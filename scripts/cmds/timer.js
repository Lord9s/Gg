module.exports = {
  config: {
    name: "timer",
    version: "1.2",
    author: "SKY",
    shortDescription: "Set a timer for minutes, seconds, or hours and get notified when it's up.",
    category: "Tool",
    guide: "{prefix}timer <time_spec>",
    envConfig: {}
  },

  onStart: async function({ message, args }) {
    // Check if the user provided a valid time specification
    if (args.length < 1) {
      message.reply("Invalid input. Please use the format: {prefix}timer <time_spec>");
      return;
    }

    const timeSpec = args.join(" ");
    const timeInMilliseconds = parseTimeSpec(timeSpec);

    if (timeInMilliseconds === null) {
      message.reply("Invalid time specification. Please use a valid format, e.g., '10 minutes 30 seconds'.");
      return;
    }

    // Set a timer using setTimeout
    setTimeout(() => {
      message.reply(`Time's up! Your timer for ${formatTimeSpec(timeSpec)} has expired.`);
    }, timeInMilliseconds);

    message.reply(`Timer set for ${formatTimeSpec(timeSpec)}. You will be notified when it's up.`);
  },
  onEvent: async function() {}
};

function parseTimeSpec(timeSpec) {
  const regex = /(\d+)\s*(hour|hr|hours|minute|min|minutes|second|sec|seconds)/gi;
  let timeInMilliseconds = 0;
  let match;

  while ((match = regex.exec(timeSpec)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    if (!isNaN(value)) {
      switch (unit) {
        case "hour":
        case "hr":
        case "hours":
          timeInMilliseconds += value * 60 * 60 * 1000;
          break;
        case "minute":
        case "min":
        case "minutes":
          timeInMilliseconds += value * 60 * 1000;
          break;
        case "second":
        case "sec":
        case "seconds":
          timeInMilliseconds += value * 1000;
          break;
      }
    }
  }

  return timeInMilliseconds > 0 ? timeInMilliseconds : null;
}

function formatTimeSpec(timeSpec) {
  return timeSpec.replace(/(\d+)\s*(hour|hr|hours|minute|min|minutes|second|sec|seconds)/gi, "$1 $2");
}