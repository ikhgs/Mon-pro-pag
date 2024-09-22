const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./sendMessage');

const commands = {};

// Charger les commandes
fs.readdirSync(path.join(__dirname, '../commands')).forEach(file => {
    const command = require(`../commands/${file}`);
    commands[command.config.name] = command;
});

async function handleMessage(event) {
    const senderID = event.senderID;

    if (event.message) {
        const commandName = 'principe'; // Toujours utiliser la commande principe
        const command = commands[commandName];

        if (command) {
            command.onChat({ event, api: sendMessage });
        }
    }
}

module.exports = { handleMessage };
