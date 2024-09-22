const axios = require("axios");

module.exports = {
  config: {
    name: "principe",
    author: "Bruno",
    version: "1.0.0",
    category: "Ai",
    shortDescription: {
      en: "Automatic Image/Text Response Bot"
    }
  },

  onChat: async function ({ event, api }) {
    const message = event.message?.text?.toLowerCase();
    const senderID = event.sender.id;

    // Si une image est envoyée
    if (event.message.attachments && event.message.attachments[0].type === "image") {
      const imageUrl = event.message.attachments[0].payload.url;

      try {
        // Appel à l'API Gemini pour traiter l'image
        const response = await callGeminiApi(imageUrl);

        // Répondre à l'utilisateur avec le résultat de l'API
        const res = `🔍 Voici ce que j'ai trouvé à propos de l'image que vous avez envoyée :\n\n${response}`;
        api.sendMessage(senderID, res);
      } catch (error) {
        // Gérer les erreurs éventuelles lors de l'appel à l'API
        console.error("Erreur lors de l'appel à l'API Gemini : ", error);
        api.sendMessage(senderID, "Désolé, une erreur est survenue lors du traitement de l'image.");
      }
    } else if (message) {
      // Répondre à l'utilisateur basé sur le texte
      const res = await principe(message || "hello", senderID);
      api.sendMessage(senderID, res);
    }
  }
};

// Fonction pour appeler l'API Gemini pour traiter l'image
async function callGeminiApi(imageUrl) {
  const apiUrl = "https://gemini-ap-espa-bruno.onrender.com/api/gemini";  // URL de votre API Gemini

  try {
    const data = {
      prompt: "Analyse cette image.",
      customId: "unique_user_id", // Remplacez par l'ID unique de l'utilisateur
      link: imageUrl
    };

    const response = await axios.post(apiUrl, data);
    
    // Supposons que l'API renvoie une réponse avec une description de l'image
    return response.data.message;  // Adapter selon la réponse de l'API
  } catch (error) {
    console.error("Erreur lors de l'appel API : ", error);
    throw error;
  }
}

// Fonction fictive `principe` qui gère la conversation basée sur le texte
async function principe(message, senderID) {
  return `Vous avez dit : ${message}`;
}
