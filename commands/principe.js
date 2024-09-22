const axios = require('axios');

let conversationHistory = {};
let imageCache = {}; // Stocker les images par utilisateur

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

        const data = { prompt, customId, link };
        const res = await axios.post('https://gemini-ap-espa-bruno.onrender.com/api/gemini', data);

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
        name: "principe",
        author: "Bruno",
        version: "1.0.0",
        category: "Ai",
        shortDescription: {
            en: "Automatic Image/Text Response Bot"
        }
    },
    onChat: async function ({ event, api }) {
        const message = event.body?.toLowerCase();
        const senderID = event.senderID;
        let res;

        // Si une image est envoyée
        if (event.attachments?.[0]?.type === "photo") {
            const imageUrl = event.attachments[0].url;
            imageCache[senderID] = imageUrl;

            res = "✨Photo reçue !✨\nAjoutez un texte pour expliquer ce que vous voulez savoir.";
            api.sendMessage(res, event.threadID);

        } else if (imageCache[senderID]) {
            const imageUrl = imageCache[senderID];
            res = await principe(message || "Merci pour l'image !", senderID, imageUrl);
            delete imageCache[senderID];
        } else {
            res = await principe(message || "Hello", senderID);
        }

        if (!imageCache[senderID]) {
            api.sendMessage(res, event.threadID);
        }
    }
};
