const commands = require('../commands');

const handleMessage = async ({ event, api }) => {
    const senderID = event.sender.id;
    const message = event.message.text;

    // Exécuter les commandes appropriées
    for (const command of Object.values(commands)) {
        if (command.onChat) {
            await command.onChat({ event, api });
        }
    }
};

module.exports = handleMessage;
