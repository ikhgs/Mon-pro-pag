const express = require('express');
const bodyParser = require('body-parser');
const { onChat } = require('./handles/handleMessage'); // Importation de handleMessage
const axios = require('axios');

// Charger les variables d'environnement
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

const app = express();
app.use(bodyParser.json());

app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(entry => {
            const event = entry.messaging[0];
            const senderID = event.sender.id;

            if (event.message) {
                onChat(event, { sendMessage });
            }
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// Fonction pour envoyer des messages
function sendMessage(recipientId, messageText) {
    const requestBody = {
        recipient: { id: recipientId },
        message: { text: messageText },
    };

    axios.post(`https://graph.facebook.com/v14.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, requestBody)
        .then(response => {
            console.log('Message envoyé : ', response.data);
        })
        .catch(error => {
            console.error('Impossible d\'envoyer le message : ', error.response.data);
        });
}

app.listen(10000, () => {
    console.log('Server is running on port 10000');
});
