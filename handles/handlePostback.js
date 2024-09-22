function handlePostback(event) {
    const senderID = event.senderID;
    const payload = event.postback.payload;

    console.log(`Received postback for user ${senderID} with payload: ${payload}`);
}

module.exports = { handlePostback };
