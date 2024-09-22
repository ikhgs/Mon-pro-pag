const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const handleMessage = require('./handles/handleMessage');
const handlePostback = require('./handles/handlePostback');

dotenv.config(); // Charger les variables d'environnement

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Endpoint pour vérifier le webhook
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook validé');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403); // Forbidden
        }
    }
});

// Endpoint pour recevoir les messages
app.post('/webhook', async (req, res) => {
    const { event } = req.body;

    if (event) {
        if (event.postback) {
            await handlePostback({ event, api: { sendMessage: sendMessageFunction } }); // Remplacez par votre fonction d'envoi
        } else {
            await handleMessage({ event, api: { sendMessage: sendMessageFunction } }); // Remplacez par votre fonction d'envoi
        }
    }

    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
