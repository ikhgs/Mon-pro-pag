const handlePostback = async ({ event, api }) => {
    const payload = event.postback.payload;

    if (payload) {
        await api.sendMessage(`Postback reçu : ${payload}`, event.sender.id);
    }
};

module.exports = handlePostback;
