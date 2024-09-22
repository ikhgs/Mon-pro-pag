const axios = require('axios');

module.exports = {
    onChat: async function({ event, api }) {
        const senderID = event.senderID;
        const message = event.body;

        // Simuler une réponse en fonction de l'image envoyée par l'utilisateur
        if (event.attachments && event.attachments.length > 0 && event.attachments[0].type === 'image') {
            const imageUrl = event.attachments[0].payload.url;
            
            // Appel à une API pour traiter l'image (par exemple, votre API Gemini)
            try {
                const response = await axios.post('https://gemini-ap-espa-bruno.onrender.com/analyze-image', {
                    imageUrl: imageUrl
                });

                const botResponse = response.data.response;

                // Répondre à l'utilisateur avec la réponse de l'API
                api.sendMessage(botResponse, senderID);
            } catch (error) {
                console.error('Erreur lors de la requête API:', error);
                api.sendMessage("Désolé, une erreur est survenue lors du traitement de l'image.", senderID);
            }
        } else {
            // Si ce n'est pas une image, envoyer un message par défaut
            api.sendMessage("Merci d'envoyer une image pour commencer.", senderID);
        }
    }
};
