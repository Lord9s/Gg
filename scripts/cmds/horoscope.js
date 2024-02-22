const axios = require('axios');

async function getHoroscope(zodiacSign) {
  try {
    const apiUrl = 'https://daily-horoscope-api.herokuapp.com';
    const response = await axios.get(`${apiUrl}/horoscope/${zodiacSign.toLowerCase()}`);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to fetch horoscope. Status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Error fetching horoscope: ${error.message}`);
  }
}

module.exports = {
  config: {
    name: "horoscope",
    version: "1.0",
    role: 0,
    author: "SKY",
    shortDescription: "Get your daily horoscope",
    category: "Astrology",
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      if (args.length !== 1) {
        return api.sendMessage('Please provide your zodiac sign. For example: !horoscope Aries', event.threadID);
      }

      const zodiacSign = args[0].toLowerCase();
      const horoscope = await getHoroscope(zodiacSign);

      api.sendMessage(`🌟 ${zodiacSign.toUpperCase()} Horoscope 🌟\n${horoscope}`, event.threadID);
    } catch (error) {
      console.error('[ERROR]', error.message);
      api.sendMessage('An error occurred while fetching the horoscope.', event.threadID);
    }
  },
};