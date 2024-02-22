module.exports = {
  config: {
    name: "ping",
    aliases: ["p"],
    version: "1.0",
    author: "Orochi Team",//command modified by Aryan Chauhan don't change my author name
    role: 0,
    shortDescription: {
      en: "Displays the current ping of the bot's system."
    },
    longDescription: {
      en: "Displays the current ping of the bot's system."
    },
    category: "System",
    guide: {
      en: "Use {p}ping to check the current ping of the bot's system."
    }
  },
  onStart: async function ({ api, event, args }) {
    const timeStart = Date.now();
    await api.sendMessage("💬 𝗖𝗛𝗘𝗖𝗞𝗜𝗡𝗚 𝗣𝗜𝗡𝗚...\n┏━━━━━━━━━━━━❀\n📝 Checking Bot's ping. 💌 Please wait......\n┗━━━━━━━━━━━━❀", event.threadID);
    const ping = Date.now() - timeStart;
    api.sendMessage(`💬 𝗕𝗢𝗧 𝗦𝗘𝗥𝗩𝗘𝗥 𝗣𝗜𝗡𝗚:\n┏━━━━━━━━━━━━❀\n📝 The current ping is 【 ${ping} MS 】\n┗━━━━━━━━━━━━❀`, event.threadID);
  }
};