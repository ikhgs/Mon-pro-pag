const commands = require('../commands');

module.exports = {
    // Votre logique pour gérer les messages ici
    onChat: async function({ event, api }) {
        // Implémentation de la logique de chat ici
        const command = event.body.toLowerCase();
        
        if (command.startsWith('!')) { // Exemple de commande
            const commandName = command.substring(1);
            if (commands[commandName]) {
                await commands[commandName].onChat({ event, api });
            } else {
                api.sendMessage("Commande inconnue.", event.threadID);
            }
        }
    }
};
