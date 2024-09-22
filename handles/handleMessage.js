const fs = require('fs');
const path = require('path');

// Importer dynamiquement toutes les commandes du dossier 'commands'
const commands = {};
const commandsPath = path.join(__dirname, '../commands');

// Charger tous les fichiers de commandes
fs.readdirSync(commandsPath).forEach(file => {
    if (file.endsWith('.js')) {
        const command = require(path.join(commandsPath, file));
        const commandName = file.replace('.js', '');
        commands[commandName] = command;
    }
});

module.exports = {
    onChat: async function(event, api) {
        const senderID = event.sender.id;

        // Vérifier si le message existe dans l'événement
        const message = event.message?.text || '';

        // Vérifier si le message commence par une commande
        if (message.startsWith('!')) {
            const commandName = message.substring(1); // Retirer le '!' pour obtenir le nom de la commande
            if (commands[commandName] && typeof commands[commandName].onChat === 'function') {
                await commands[commandName].onChat({ event, api });
            } else {
                api.sendMessage("Commande inconnue.", senderID);
            }
        } else if (event.message?.attachments) {
            // Si c'est une image, gérer cela
            api.sendMessage("Merci d'envoyer une image pour commencer.", senderID);
        }
    }
};
