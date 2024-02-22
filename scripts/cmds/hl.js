const axios = require("axios");
const fs = require("fs");
const path = require("path");

const categories = {
  farlight: "farlight+highlight",
  codm: "codm+highlight",
  mlbb: "mlbb+highlight",
  roblox: "roblox+edit",
  dota2: "dota+2+highlight",
  lol: "League+of+Legends+highlight",
  breakout: "arena+breakout+highlight",
  worldwar: "world+war+zone+edit"
};

module.exports = {
  config: {
    name: "hl",
    aliases: [],
    author: "Kim Joseph DG Bien & kshitiz",// converted by kshitiz
    version: "2.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "get video game highlights"
    },
    category: "video",
    guide: {
      en: "{p}{n} category"
    }
  },
  onStart: async function ({ api, event, args }) {
    try {
      if (args.length === 0) {
        api.sendMessage("Please specify a game name or use '/hl list' to show available categories.", event.threadID, event.messageID);
        return;
      }

      const command = args[0].toLowerCase();

      if (command === "list") {
        const availableCategories = Object.keys(categories).join(", ");
        api.sendMessage(`List: ${availableCategories}`, event.threadID, event.messageID);
        return;
      }

      const categoryQuery = categories[command];

      if (!categoryQuery) {
        api.sendMessage(`Use "/hl list" to show all gamename.`, event.threadID, event.messageID);
        return;
      }

      api.sendMessage(`Sending random ${command} video...`, event.threadID, event.messageID);

      const response = await axios.get(`https://hiroshi.hiroshiapi.repl.co/tiktok/searchvideo?keywords=${categoryQuery}`);
      const videoUrl = response.data.data.videos[0]?.play; 

      if (!videoUrl) {
        api.sendMessage(`No videos found for ${command}.`, event.threadID, event.messageID);
        return;
      }

      const filePath = path.join(__dirname, `/cache/${command}_video.mp4`);
      const writer = fs.createWriteStream(filePath);

      const videoResponse = await axios({
        method: 'get',
        url: videoUrl,
        responseType: 'stream'
      });

      videoResponse.data.pipe(writer);

      writer.on('finish', () => {
        const message = `${command} highlight video:`;
        api.sendMessage(
          { body: message, attachment: fs.createReadStream(filePath) },
          event.threadID,
          () => fs.unlinkSync(filePath)
        );
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
};
