const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { handleMessage } = require("./handles/handleMessage");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Vérification du webhook
app.get("/webhook", (req, res) => {
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Gestion des messages entrants
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    body.entry.forEach((entry) => {
      const event = entry.messaging[0];

      if (event.message) {
        handleMessage(event, sendMessage);  // Passe `sendMessage` à `handleMessage`
      }
    });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

// Fonction pour envoyer un message via l'API Facebook Messenger
function sendMessage(recipientId, response) {
  const request_body = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: response,
    },
  };

  axios
    .post(
      `https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      request_body
    )
    .then(() => {
      console.log("Message envoyé avec succès !");
    })
    .catch((err) => {
      console.error("Erreur lors de l'envoi du message : " + err);
    });
}

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
        
