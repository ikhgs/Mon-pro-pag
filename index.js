require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { handleMessage } = require("./handles/handleMessage");
const { handlePostback } = require("./handles/handlePostback");

const app = express();
const PORT = process.env.PORT || 5000;

// Utiliser bodyParser pour les requêtes JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PAGE_ACCESS_TOKEN depuis le fichier .env
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Vérification de la validité du token
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Importer axios pour envoyer des requêtes HTTP
const axios = require('axios');

// Route pour la vérification du webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Invalid token");
  }
});

// Route pour recevoir les messages
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    body.entry.forEach((entry) => {
      const event = entry.messaging[0];

      // Si un message est reçu
      if (event.message) {
        handleMessage(event, sendMessage);  // Passez sendMessage ici
      } 
      // Si un postback est reçu
      else if (event.postback) {
        handlePostback(event, sendMessage); // Passez sendMessage ici
      }
    });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

// Fonction pour envoyer des messages via l'API Messenger
function sendMessage(recipientId, response) {
  const request_body = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: response,
    },
  };

  // Faire une requête POST à l'API Messenger avec axios
  axios.post(`https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, request_body)
    .then(() => {
      console.log("Message envoyé avec succès !");
    })
    .catch((err) => {
      console.error("Impossible d'envoyer le message : " + err);
    });
}

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
