  const axios = require("axios");
  const fs = require("fs");

  const history = {};
  let isFontEnabled = true;

  module.exports = {
    config: {
      name: "nyx",
      version: "3.1",
      role: 0,
      author: "Hazeyy", //Subash
      countDown: 5,
      longDescription: "(𝙸𝚖𝚊𝚐𝚎 𝙿𝚛𝚘𝚖𝚙𝚝 )",
      category: "ai",
      guide: { en: "{pn} <query>" }
    },

    onStart: async function ({ api, event }) {
      const args = event.body.split(/\s+/);
      args.shift();
      const tzt = args.join(' ').split('|').map(item => item.trim());
      const txt = tzt[0];
      const txt2 = tzt.slice(1).join(' ');

      if (!txt || !txt2) {
        return api.sendMessage("🎀 𝚄𝚜𝚎: [ 𝚙𝚛𝚘𝚖𝚙𝚝 ] | [ 1-20 ]", event.threadID, event.messageID);
      }

      api.sendMessage("🗨️ | 𝙶𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚗𝚐 𝚙𝚛𝚘𝚖𝚙𝚝, 𝚙𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...", event.threadID, event.messageID);

      try {
        const enctxt = encodeURI(txt);
        const url = `https://hazeyy-api-img-prompt.kyrinwu.repl.co/api/img/prompt?prompt=${enctxt}&model=${txt2}`;
        const responses = await Promise.all(
          Array.from({ length: 4 }, async (_, index) => {
            const response = await axios.get(url, { responseType: "arraybuffer" });
            return response.data;
          })
        );

        const paths = [];

        responses.forEach((data, index) => {
          const path = __dirname + `/cache/image${index + 1}.png`;
          fs.writeFileSync(path, Buffer.from(data, "binary"));
          paths.push(path);
        });

        const senderName = "🎀 𝙽𝚢𝚡 ( 𝙰𝙸 )";
        const message = `${senderName}\n\n𝙷𝚎𝚛𝚎'𝚜 𝚢𝚘𝚞𝚛 𝙸𝚖𝚊𝚐𝚎 𝚙𝚛𝚘𝚖𝚙𝚝`;

        const combinedMessage = {
          body: message,
          attachment: paths.map((path) => fs.createReadStream(path)),
        };

        api.sendMessage(combinedMessage, event.threadID, () => paths.forEach(fs.unlinkSync));
      } catch (e) {
        api.sendMessage("🚫 𝙴𝚛𝚛𝚘𝚛 𝚒𝚗 𝙸𝚖𝚊𝚐𝚎 𝙶𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚘𝚗", event.threadID, event.messageID);
      }
    }
  };