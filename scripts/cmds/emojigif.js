module.exports = {
  config: {
    name: "emojigif",
    aliases: ["emojig", "gemoji"],
    version: "1.0",
    author: "JARiF",
    countDown: 15,
    role: 0,
    category: "download",
    guide: {
      en: "{pn} emoji"
    }
  },

  onStart: async function ({ message, args }) {
    try {
      const emoji = args.join(" ");

      if (!emoji) {
        return message.reply("Please provide an emoji.");
      }

      const response = `https://www.annie-jarif.repl.co/emoji-gif?emoji=${emoji}`;

      const stream = await global.utils.getStreamFromURL(response);

      message.reply({ attachment: stream });
    } catch (error) {
      message.reply("Error: " + error);
    }
  }
};
