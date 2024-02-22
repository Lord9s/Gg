module.exports = {
  config: {
    name: "bet",
    version: "1.0",
    author: "SKY",
    shortDescription: {
      en: "Bet game",
    },
    longDescription: {
      en: "A simple betting game. You can double your bet or lose it.",
    },
    category: "game",
  },
  langs: {
    en: {
      invalid_amount: "Please enter a valid bet amount.",
      not_enough_money: "You don't have enough money to place this bet.",
      win_message: "Congratulations! You won %1$💸 and doubled your bet! 🎉",
      lose_message: "You lost %1$... 😔",
    },
  },
  onStart: async function ({ args, message, event, envCommands, usersData, commandName, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);
    const betAmount = parseInt(args[0]);

    if (isNaN(betAmount) || betAmount <= 0) {
      return message.reply(getLang("invalid_amount"));
    }

    if (betAmount > userData.money) {
      return message.reply(getLang("not_enough_money"));
    }

    const win = Math.random() < 0.5; // 50% chance to win

    let winnings = 0;

    if (win) {
      winnings = betAmount * 2; // Double the bet if won
    } else {
      winnings = -betAmount; // Lose the bet if lost
    }

    await usersData.set(senderID, {
      money: userData.money + winnings,
      data: userData.data,
    });

    const messageText = getBetResultMessage(win, winnings, getLang);

    return message.reply(messageText);
  },
};

function getBetResultMessage(win, winnings, getLang) {
  if (win) {
    return getLang("win_message", winnings) + " 🎉";
  } else {
    return getLang("lose_message", -winnings) + " 😔";
  }
}