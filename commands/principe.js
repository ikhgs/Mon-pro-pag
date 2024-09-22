const axios = require("axios");

// ID de l'administrateur (remplacez par le vrai ID)
const ADMIN_ID = "100041841881488";

// Variable globale pour contrôler si le bot doit répondre
let botEnabled = true;

// Dictionnaire pour stocker l'historique des conversations par utilisateur
let conversationHistory = {};
let imageCache = {}; // Stocker l'image temporairement par utilisateur

// Fonction pour gérer l'historique complet
async function principe(prompt, customId, link = null) {
  try {
    if (!conversationHistory[customId]) {
      conversationHistory[customId] = { prompts: [], lastResponse: "" };
    }

    if (link) {
      conversationHistory[customId].prompts.push({ prompt: "Image reçue", link });
    } else {
      conversationHistory[customId].prompts.push({ prompt });
    }

    let context = conversationHistory[customId].prompts
      .map((entry) => (entry.link ? `Image: ${entry.link}` : entry.prompt))
      .join("\n");

    const data = {
      prompt: prompt,
      customId,
      link,
    };

    const res = await axios.post(`https://gemini-ap-espa-bruno.onrender.com/api/gemini`, data);

    conversationHistory[customId].lastResponse = res.data.message;

    const title = "🍟❤️ Bruno IA ❤️🍟\n";
    let responseWithTitle = `${title}${res.data.message}`;

    return responseWithTitle;
  } catch (error) {
    return `Erreur: ${error.message}`;
  }
}

module.exports = {
  config: {
    name: "principe", // Le nouveau nom de la commande
    author: "Bruno",
    version: "1.0.0",
    category: "Ai",
    shortDescription: {
      en: "Automatic Image/Text Response Bot",
    },
  },

  onStart: async function ({ api }) {
    // Initialisation si nécessaire
  },

  onChat: async function ({ event, api, sendMessage }) {
    const message = event.body?.toLowerCase();
    const senderID = event.senderID;

    // Vérification des commandes administrateur "principe off" et "principe on"
    if (message === "principe off" || message === "principe on") {
      if (senderID !== ADMIN_ID) {
        sendMessage(senderID, "❌ Vous n'avez pas la permission d'utiliser cette commande.");
        return;
      }

      if (message === "principe off") {
        botEnabled = false;
        sendMessage(senderID, "🚫 Le bot est maintenant désactivé pour tous.");
        return;
      } else if (message === "principe on") {
        botEnabled = true;
        sendMessage(senderID, "✅ Le bot est maintenant activé pour tous.");
        return;
      }
    }

    // Si le bot est désactivé, ne pas répondre
    if (!botEnabled) {
      return;
    }

    let res;

    // Si une image est envoyée
    if (event.attachments?.[0]?.type === "photo") {
      const imageUrl = event.attachments[0].url;
      imageCache[senderID] = imageUrl;

      res = "✨Photo reçue avec succès !✨\n Pouvez-vous ajouter un texte pour m'expliquer ce que vous voulez savoir à propos de cette photo ?";
      sendMessage(senderID, res);

    } else if (imageCache[senderID]) {
      const imageUrl = imageCache[senderID];
      res = await principe(message || "Merci pour l'image !", senderID, imageUrl);
      delete imageCache[senderID];
    } else {
      res = await principe(message || "hello", senderID);
    }

    // Envoyer la réponse à l'utilisateur si ce n'était pas déjà fait
    if (!imageCache[senderID]) {
      sendMessage(senderID, res);
    }
  },
};
