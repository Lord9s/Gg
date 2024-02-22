const axios = require("axios");
const fs = require("fs-extra");
const ytdl = require("@distube/ytdl-core");

module.exports = {
  sentVideos: [],
  currentIndex: 0,

  config: {
    name: "aniedit2",
    version: "3.0",
    role: 0,
    author: "kshitiz",
    cooldowns: 40,
    shortDescription: "Fetch a random video from a YouTube playlist and send it",
    longDescription: "",
    category: "video",
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "@distube/ytdl-core": ""
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      const loadingMessage = await api.sendMessage("𝗟𝗼𝗮𝗱𝗶𝗻𝗴 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝗮𝗻𝗶𝗺𝗲 𝘃𝗶𝗱𝗲𝗼..💫", event.threadID, null, event.messageID);

      const apiKey = "AIzaSyAO1tuGus4-S8RJID51f8WJAM7LXz1tVNc";
      const playlistId = "PLaPLzpOlr3JSGd0fFH1jpBeZ9-mMeUQ-P";

      // Check if all videos are sent, reset if necessary
      if (this.currentIndex >= this.sentVideos.length) {
        this.currentIndex = 0;
        this.sentVideos = [];
      }

      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=contentDetails&maxResults=50`;
      const response = await axios.get(playlistUrl);

      const items = response.data.items;
      const videoIds = items.map((item) => item.contentDetails.videoId);

      // Filter out videos that have already been sent
      const remainingVideos = videoIds.filter((videoId) => !this.sentVideos.includes(videoId));

      if (remainingVideos.length === 0) {
        // All videos have been sent, reset the sentVideos array
        this.currentIndex = 0;
        this.sentVideos = [];
      }

      // Select a random video from the remaining videos
      const randomIndex = Math.floor(Math.random() * remainingVideos.length);
      const randomVideoId = remainingVideos[randomIndex];

      // Add the selected video to the sentVideos array
      this.sentVideos.push(randomVideoId);

      const stream = ytdl(`https://www.youtube.com/watch?v=${randomVideoId}`, { filter: "audioandvideo" });
      const fileName = `${randomVideoId}.mp4`;
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

          api.unsendMessage(loadingMessage.messageID);
          return api.sendMessage('❌ | The file could not be sent because it is larger than 25MB.', event.threadID, null, event.messageID);
        }

        const replyMessage = {
          body: '📹 | 𝗛𝗲𝗿𝗲\'𝘀 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝗮𝗻𝗶𝗺𝗲 𝘃𝗶𝗱𝗲𝗼',
          attachment: fs.createReadStream(filePath)
        };

        api.sendMessage(replyMessage, event.threadID, null, event.messageID, () => {
          fs.unlinkSync(filePath);
        });

        setTimeout(() => {
          api.unsendMessage(loadingMessage.messageID);
        }, 1000);
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('An error occurred while processing the command.', event.threadID, null, event.messageID);
    }
  },
};