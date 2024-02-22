const axios = require('axios');

module.exports = {
  config: {
    name: "quote2",
    aliases: [],
    author: "kshitiz",  
    version: "2.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "Get a quote based on category or see available categories."
    },
    longDescription: {
      en: "Get a quote based on category or see available categories."
    },
    category: "fun",
    guide: {
      en: "{p}quote [category]"
    }
  },
  onStart: async function ({ api, event, args }) {
    const apiKey = "0Hr3RnpBTgQvQ9np4ibDrQ==CkYJq9yAT5yk6vIn";
    const apiUrl = "https://api.api-ninjas.com/v1/quotes?category=";

    const categories = [
      "age", "alone", "amazing", "anger", "architecture",
      "art", "attitude", "beauty", "best", "birthday",
      "business", "car", "change", "communications", "computers",
      "cool", "courage", "dad", "dating", "death",
      "design", "dreams", "education", "environmental", "equality",
      "experience", "failure", "faith", "family", "famous",
      "fear", "fitness", "food", "forgiveness", "freedom",
      "friendship", "funny", "future", "god", "good",
      "government", "graduation", "great", "happiness", "health",
      "history", "home", "hope", "humor", "imagination",
      "inspirational", "intelligence", "jealousy", "knowledge", "leadership",
      "learning", "legal", "life", "love", "marriage",
      "medical", "men", "mom", "money", "morning",
      "movies", "success"
    ];

    if (args.length === 0) {
      
      const categoryList = categories.join(', ');
      return api.sendMessage(`Available categories: ${categoryList}`, event.threadID, event.messageID);
    }

    const category = args[0].toLowerCase();

    if (!categories.includes(category)) {
      return api.sendMessage(`Invalid category. Available categories: ${categories.join(', ')}`, event.threadID, event.messageID);
    }

    const url = `${apiUrl}${category}`;

    try {
      const response = await axios.get(url, { headers: { "X-API-KEY": apiKey } });
      const quoteData = response.data[0];

      if (quoteData) {
        const { quote, author } = quoteData;
        return api.sendMessage(`"${quote}" - ${author}`, event.threadID, event.messageID);
      } else {
        return api.sendMessage(`No quotes found for category: ${category}`, event.threadID);
      }
    } catch (error) {
      console.error(error);
      return api.sendMessage("An error occurred while fetching the quote. Please try again later.", event.threadID);
    }
  }
};
