const axios = require('axios');

module.exports = {
  config: {
    name: 'pickupline',
    aliases: ['lines', 'flirt',],
    version: '1.0',
    author: 'JV',
    role: 0,
    category: 'utility',
    shortDescription: {
      en: 'Tells a random pickup line.'
    },
    longDescription: {
      en: 'Tells a random pickup line fetched from a pickup line API.'
    },
    guide: {
      en: '{pn}'
    }
  },
  onStart: async function ({ api, event }) {
    try {
      const response = await axios.get('https://vinuxd.vercel.app/api/pickup');

      if (response.status !== 200 || !response.data || !response.data.pickup) {
        throw new Error('Invalid or missing response from pickup line API');
      }

      const pickupline = response.data.pickup;

      const messageID = await api.sendMessage(pickupline, event.threadID);

      if (!messageID) {
        throw new Error('Failed to send message with pickup line');
      }

      console.log(`Sent pickup line with message ID ${messageID}`);
    } catch (error) {
      console.error(`Failed to send pickup line: ${error.message}`);
      api.sendMessage('Sorry, something went wrong while trying to tell a pickup line. Please try again later.', event.threadID);
    }
  }
};
