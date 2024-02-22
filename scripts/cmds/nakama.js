const fs = require('fs');
module.exports = {
  config: {
    name: "nakama",
    version: "1.0",
    author: "SKY",
    countDown: 5,
    role: 0,
    shortDescription: "no prefix",
    longDescription: "no prefix",
    category: "fun",
  },
  onStart: async function(){},
  onChat: async function({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "nakama") {
      return message.reply({
        body: "Everything",
        attachment: fs.createReadStream("nakama.mp4"),
      });
    }
  }
};