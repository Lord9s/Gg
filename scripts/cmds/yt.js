module.exports = {
  config: {
    name: "yt",
    version: "1.0",
    role: 0,
    author: "SKY",
    cooldowns: 5,
    shortdescription: "Download video from YouTube",
    longdescription: "",
    category: "media", // Changed category to "media"
    usages: "{pn} video name",
    dependencies: {
      "fs-extra": "",
      "request": "",
      "axios": "",
      "@distube/ytdl-core": "", // Updated ytdl-core import
      "yt-search": ""
    }
  },

  onStart: async ({ api, event }) => {
    const axios = require("axios");
    const fs = require("fs-extra");
    const ytdl = require("@distube/ytdl-core");
    const request = require("request");
    const yts = require("yt-search");

    const input = event.body;
    const text = input.substring(12);
    const data = input.split(" ");

    if (data.length < 2) {
      return api.sendMessage("Please specify a video name.", event.threadID);
    }

    data.shift();
    const videoName = data.join(" ");

    try {
      api.sendMessage(`Searching video for "${videoName}". Please wait...`, event.threadID);

      const searchResults = await yts(videoName, { video: true });
      if (!searchResults.videos.length) {
        return api.sendMessage("No video found.", event.threadID, event.messageID);
      }

      const video = searchResults.videos[0];
      const videoUrl = video.url;

      const stream = ytdl(videoUrl);

      const fileName = `${event.senderID}.mp4`;
      const filePath = __dirname + `/cache/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading video: ${info.videoDetails.title}`);
      });

      stream.on('end', () => {
        console.info('[DOWNLOADER] Downloaded');

        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          return api.sendMessage('The file could not be sent because it is larger than 25MB.', event.threadID);
        }

        const message = {
          body: ` Here's your video | Title: ${video.title}\n Duration: ${video.duration.timestamp}`,
          attachment: fs.createReadStream(filePath)
        };

        api.sendAttachment(message.attachment, event.threadID, message.body, event.messageID, () => {
          fs.unlinkSync(filePath);
        });
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('An error occurred while processing the command.', event.threadID);
    }
  }
};