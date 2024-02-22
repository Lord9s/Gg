const axios = require('axios');

module.exports = {
  config: {
    name: "imagine2",
    aliases: ["i2"],
    author: "Tashrif",
    version: "1.0",
    countDown: 10,
    role: 0,
    shortDescription: "Generates an image from a text description",
    longDescription: "Generates an image from a text description",
    category: "ai",
    guide: {
      en: `{pn} prompt | model | ratio\\Models:\\
        1: Imagine V4
        2: Creative V4
        3: Imagine V3
        4: Imagine V1`,
      
    }
  },

  langs: {
    en: {
      loading: "Generating image, please wait...",
      error: "An error occurred, please try again later"
    }
  },

  onStart: async function ({ event, message, getLang, threadsData, api, args }) {
    const { threadID } = event;

    const info = args.join(" ");
    if (!info) {
      return message.reply(`- baka, type your imagination!`);
    } else {
      const msg = info.split("|");
      const text = msg[0];
      const model = msg[1] || '1'; 
      const timestamp = new Date().getTime();

      try {
        let msgSend = message.reply(getLang("loading"));
        const { data } = await axios.get(
      `https://prodia.aligned26.repl.co/generate?prompt=${text}&model=${model}`
        );

        const imageUrls = data.imageUrls[0];

        const shortLink = await require('tinyurl').shorten(imageUrls);
       
        await message.unsend((await msgSend).messageID);
        if (imageUrls) {
          message.reply({
            body: shortLink,
            attachment: await global.utils.getStreamFromURL(imageUrls)
          });
        } else {
          throw new Error("Failed to fetch the generated image");
        }
      } catch (err) {
        console.error(err);
        return message.reply(getLang("error"));
      }
    }
  }
};