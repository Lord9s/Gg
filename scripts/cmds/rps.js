module.exports = {
  config: {
    name: "rps",
    version: "1.0",
    author: "SKY",
    shortDescription: "Play rock-paper-scissors game with the bot.",
    category: "fun",
    guide: "{prefix}rps <rock|paper|scissors|✊|✋|✌️>"
  },
  onStart: async function ({ message, args }) {
    const textChoices = ["rock", "paper", "scissors"];
    const emojiChoices = ["✊", "✋", "✌️"];
    const userChoice = args[0];

    if (!userChoice || (!textChoices.includes(userChoice.toLowerCase()) && !emojiChoices.includes(userChoice))) {
      return message.reply("Please choose either rock, paper, scissors, ✊, ✋, or ✌️!");
    }

    const botChoice = textChoices.includes(userChoice.toLowerCase()) ? textChoices[Math.floor(Math.random() * textChoices.length)] : emojiChoices[Math.floor(Math.random() * emojiChoices.length)];

    message.reply(`You chose ${userChoice}. I chose ${botChoice}.`);

    if (userChoice.toLowerCase() === botChoice.toLowerCase()) {
      message.reply("It's a tie!");
    } else if (
      (userChoice.toLowerCase() === "rock" && botChoice === "scissors") ||
      (userChoice.toLowerCase() === "paper" && botChoice === "rock") ||
      (userChoice.toLowerCase() === "scissors" && botChoice === "paper")
    ) {
      message.reply("Congratulations! You won!");
    } else {
      message.reply("I win! Better luck next time!");
    }
  },
};