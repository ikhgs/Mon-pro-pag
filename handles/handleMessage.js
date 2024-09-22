const fs = require('fs');
const path = require('path');

const commands = {};
const commandsPath = path.join(__dirname, '../commands');

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
        const message = event.message?.text || '';

        // Vérification de l'ID
        console.log(`Envoi du message à l'ID : ${senderID}`);

        // Vérification des messages
        if (!senderID) {
            console.error("L'ID de l'expéditeur est manquant !");
            return;
        }

        // Vérification des commandes
        if (message.startsWith('!')) {
            const commandName = message.substring(1);
            if (commands[commandName] && typeof commands[commandName].onChat === 'function') {
                await commands[commandName].onChat({ event, api });
            } else {
                api.sendMessage("Commande inconnue.", senderID);
            }
        } else if (event.message?.attachments) {
            api.sendMessage("Merci d'envoyer une image pour commencer.", senderID);
        }
    }
};
