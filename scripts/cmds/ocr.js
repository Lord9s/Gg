const axios = require('axios');

module.exports = {
  config: {
    name: "ocr",
    version: "0.0",
    author: "MILAN",
    countDown: 5,
    role: 0,
    sortDescription: {
      en: 'Image to Text'
    },
    category: "Tools",
  },
  onStart: async function ({ api, args, message, event }) {
    try {
      const link = encodeURIComponent(event.messageReply.attachments[0].url);
      const lado = await axios.get(`https://sandipapi.onrender.com/imgur?link=${link}`);
      const puti = lado.data.uploaded?.image;

      if (!puti) {
        throw new Error('Image not uploaded');
      }

      const apiUrl = `https://milanbhandari.onrender.com/ocr?imageUrl=${puti}`;

      axios.get(apiUrl)
        .then(response => {
          const text = response.data.responses[0].textAnnotations[0].description;
          message.reply({ body: `Here is ImageLink: ${puti}\n\nText: ${text}` });
        })
        .catch(error => {
          message.reply(error.message);
        });
    } catch (error) {
      message.reply(error.message);
    }
  }
};