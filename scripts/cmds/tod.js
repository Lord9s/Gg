const axios = require('axios');

async function fetchDataFromAPI(apiUrl) {
  try {
    const response = await axios.get(apiUrl);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching data from API:", error.message);
    return null;
  }
}

async function translateText(text) {
  try {
    const translateUrl = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=' + encodeURIComponent(text);
    const response = await axios.get(translateUrl);
    const translatedText = response.data[0][0][0];
    return translatedText;
  } catch (error) {
    console.error("Error translating text:", error.message);
    return null;
  }
}

module.exports = {
  config: {
    name: 'truthordare',
    aliases: ["tod"],
    version: "1.0",
    author: "Samir B. Thakuri",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Play truth or dare."
    },
    longDescription: {
      en: "Challenge Yourself With Random Truth And Dares..."
    },
    category: 'game',
    guide: {
      en: "{pn}[truth/t] or {pn}[dare/d]"
    }
  },
  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    if (args.length < 1) {
      return api.sendMessage("Incorrect syntax!", threadID, messageID);
    }

    const option = args[0].toLowerCase();
    const validOptions = ["truth", 't', "dare", 'd'];

    if (!validOptions.includes(option)) {
      return api.sendMessage("Incorrect syntax!", threadID, messageID);
    }

    const apiUrl = option === "truth" || option === 't' ?
      "https://api.zahwazein.xyz/entertainment/truth?apikey=zenzkey_92d341a7630e" :
      "https://api.zahwazein.xyz/entertainment/dare?apikey=zenzkey_92d341a7630e";

    try {
      const question = await fetchDataFromAPI(apiUrl);

      if (question) {
        const translatedQuestion = await translateText(question);
        return translatedQuestion ?
          api.sendMessage(translatedQuestion, threadID, messageID) :
          api.sendMessage("Failed to translate the question.", threadID, messageID);
      } else {
        return api.sendMessage("Failed to fetch truth or dare question from API.", threadID, messageID);
      }
    } catch (error) {
      console.error('Error:', error.message);
      return api.sendMessage("Failed to fetch truth or dare question from API.", threadID, messageID);
    }
  }
};
