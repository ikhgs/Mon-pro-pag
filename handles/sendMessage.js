const axios = require('axios');

async function sendMessage(message, threadID) {
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
    
    try {
        await axios.post(
            `https://graph.facebook.com/v13.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            {
                recipient: { id: threadID },
                message: { text: message },
            }
        );
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message: ', error.message);
    }
}

module.exports = { sendMessage };
