const { getStreamsFromAttachment, checkAndTranslate } = global.utils;

module.exports = {
  config: {
    name: "tell",
    version: "1.0",
    author: "SKY",
    countDown: 5,
    role: 2,
    shortDescription: "Send multiple messages to a specific group",
    longDescription: "Send multiple messages to a specific group",
    category: "owner",
    guide: "{pn} <message> <count>",
    envConfig: {
      delayPerGroup: 250,
    },
  },

  onStart: async function ({
    message,
    api,
    event,
    args,
    commandName,
    envCommands,
  }) {
    const { delayPerGroup } = envCommands[commandName];
    const tellMessage = args.slice(0, -1).join(" "); // Extract the message to be repeated
    const count = parseInt(args.slice(-1)[0], 10); // Extract the count as the last argument

    if (!tellMessage || isNaN(count) || count < 1) {
      return message.reply(
        "Please provide a message and a positive count."
      );
    }

    try {
      const formSend = {};
      for (let i = 0; i < count; i++) {
        formSend.body = `\n\n${tellMessage}`;
        await api.sendMessage(formSend, event.threadID);
      }
      message.reply(
        `✅ Sent ${count} messages to the group successfully!`
      );
    } catch (error) {
      console.error(error);
      message.reply(
        `❌ Error occurred while sending messages to the group.`
      );
    }
  },
};