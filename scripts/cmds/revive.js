const fs = require('fs-extra');
let restartIntervalId;

module.exports = {
  config: {
    name: 'revive',
    version: '1.0',
    author: 'Rajveer',
    role: 2,
    shortDescription: 'Auto restart bot',
    longDescription: 'Enable/Disable auto restart bot',
    category: 'Owner',
    guide: '{prefix}revive toggle',
  },

  onStart: async function ({ api, getLang }) {
    // Load the initial status from a file (change the path accordingly)
    const pathFile = `${__dirname}/tmp/revive_status.txt`;
    const isAutoRestartEnabled = fs.existsSync(pathFile) && fs.readFileSync(pathFile, 'utf-8') === 'true';

    if (isAutoRestartEnabled) {
      this.enableAutoRestart({ api, getLang });
    }
  },

  onToggle: function ({ api, getLang }) {
    const pathFile = `${__dirname}/tmp/revive_status.txt`;

    // Toggle the auto-restart status
    const isAutoRestartEnabled = !fs.existsSync(pathFile) || fs.readFileSync(pathFile, 'utf-8') !== 'true';
    fs.writeFileSync(pathFile, isAutoRestartEnabled ? 'true' : 'false');

    if (isAutoRestartEnabled) {
      this.enableAutoRestart({ api, getLang });
    } else {
      this.disableAutoRestart();
    }

    api.sendMessage(isAutoRestartEnabled ? getLang('enabled') : getLang('disabled'), api.getCurrentUserID());
  },

  enableAutoRestart: function ({ api, getLang }) {
    // Interval for restarting (adjust the time as needed)
    restartIntervalId = setInterval(() => {
      api.sendMessage(getLang('restarting'), api.getCurrentUserID());
      setTimeout(() => {
        this.restartBot();
      }, 5000); // Restart after 5 seconds (adjust as needed)
    }, 300000); // Notify every 5 minutes (adjust as needed)
  },

  disableAutoRestart: function () {
    clearInterval(restartIntervalId);
  },

  restartBot: function () {
    // Perform any necessary cleanup or save state before restarting
    process.exit(2);
  },

  onCommand: function ({ args, message }) {
    const subCommand = args[0]?.toLowerCase();
    if (subCommand === 'toggle') {
      this.onToggle({ api: message.api, getLang: message.getLang });
    } else {
      message.reply('Invalid sub-command. Use `{prefix}revive toggle` to toggle auto restart.');
    }
  },
};