const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "d",
    author: "OtinXSandip",
    version: "1.0",
    role: 2,
    description: "Delete orders",
    usage: "delete <file name>",
    category: "owner"
  },

  onStart: async function ({ args, message }) {
    const commandName = args[0];

    if (!commandName) {
      return message.reply("Use the command and enter the command file name");
    }

    const filePath = path.join(__dirname, '..', 'cmds', `${commandName}`);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        message.reply(`A command file has been deleted ${commandName} .`);
      } else {
        message.reply(`command file ${commandName} unavailable.`);
      }
    } catch (err) {
      console.error(err);
      message.reply(`Cannot be deleted because ${commandName}: ${err.message}`);
    }
  }
};