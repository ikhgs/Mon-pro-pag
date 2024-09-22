const axios = require("axios");

module.exports.sendMessage = function (recipientId, response) {
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
      `https://graph.facebook.com/v17.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
      request_body
    )
    .then(() => {
      console.log("Message envoyé avec succès !");
    })
    .catch((err) => {
      console.error("Erreur lors de l'envoi du message : " + err);
    });
};
