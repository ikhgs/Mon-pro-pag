const sendMessage = async (api, message, threadID) => {
    try {
        if (!message || !threadID) {
            throw new Error("Message ou threadID manquant.");
        }
        await api.sendMessage(message, threadID);
    } catch (error) {
        console.error(`Erreur lors de l'envoi du message: ${error.message}`);
    }
};

module.exports = { sendMessage };
