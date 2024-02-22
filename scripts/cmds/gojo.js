const { get } = require('axios');
const url = 'http://eu4.diresnode.com:3301';

module.exports = {
  config: {
    name: 'gojo',
    aliases: [],
    version: '1.0.0',
    author: 'Rajveer',
    countDown: 0,
    role: 0,
    shortDescription: {
      en: 'Talk to GOJO AI (continues conversation)',
    },
    longDescription: {
      en: 'Talk to GOJO AI (continues conversation)',
    },
    category: 'AI',
    guide: {
      en: '{p}gojo message / onReply',
    },
  },

  async makeApiRequest(prompt, id) {
    try {
      const response = await get(`${url}/gojo_gpt?prompt=${prompt}&idd=${id}`);
      return response.data.gojo;
    } catch (error) {
      throw error;
    }
  },

  async sendMessage(api, event, message, onReplyCallback) {
    api.sendMessage(message, event.threadID, (err, info) => {
      if (!err) {
        onReplyCallback(info.messageID);
      } else {
        console.error('Error sending message:', err);
      }
    });
  },

  onStart: async function ({ api, event, args }) {
    try {
      const prompt = args.join(' ');
      const id = event.senderID;

      if (!prompt) {
        api.sendMessage(
          `Missing input!\n\nIf you want to reset the conversation with ${this.config.name} you can use "${this.config.name} clear"`,
          event.threadID,
          event.messageID
        );
        return;
      }

      api.sendMessage('searching...', event.threadID, async (err, info) => {
        if (!err) {
          try {
            const result = await this.makeApiRequest(prompt, id);
            this.sendMessage(api, event, result, (messageID) => {
              global.GoatBot.onReply.set(messageID, {
                commandName: 'gojo',
                messageID,
                author: event.senderID,
                tempFilePath: null,
              });
            });
          } catch (error) {
            console.error('Error:', error);
            api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
          }
        } else {
          console.error('Error sending message:', err);
        }
      });
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage(error.message, event.threadID, event.messageID);
    }
  },

  onReply: async function ({ api, event, Reply, args }) {
    const { author, commandName, tempFilePath } = Reply;

    try {
      const prompt = args.join(' ');
      const id = event.senderID;

      if (!prompt) {
        api.sendMessage(
          `Missing input!\n\nIf you want to reset the conversation with ${this.config.name} you can use "${this.config.name} clear"`,
          event.threadID,
          event.messageID
        );
        return;
      }

      const result = await this.makeApiRequest(prompt, id);
      this.sendMessage(api, event, result, (messageID) => {
        global.GoatBot.onReply.set(messageID, {
          commandName: 'gojo',
          messageID,
          author: event.senderID,
          tempFilePath: null,
        });
      });
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
    }
  },
};