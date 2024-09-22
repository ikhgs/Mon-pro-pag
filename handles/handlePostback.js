module.exports.handlePostback = async (event, sendMessage) => {
  const payload = event.postback.payload;
  const senderID = event.sender.id;

  let response;

  if (payload === "GET_STARTED") {
    response = "Bienvenue ! Envoyez-moi une photo pour commencer.";
  }

  sendMessage(senderID, response);
};
