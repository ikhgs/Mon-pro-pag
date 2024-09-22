const commands = require("../commands");

module.exports.handleMessage = async (event, sendMessage) => {
  const message = event.message.text;
  const senderID = event.sender.id;

  // Appel à la commande `principe`
  if (commands.principe) {
    await commands.principe.onChat({ event, api: { sendMessage } });
  }
};
