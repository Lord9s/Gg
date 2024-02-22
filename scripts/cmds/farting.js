const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "farting",
    aliases: ["fart"],
    author: "SKY",
   version: "1.0",
    role: 0,
    shortDescription: {
      en: "Create a funny scenario of members farting at each other.",
    },
    longDescription: {
      en: "Generate a humorous image of two members farting at each other's face.",
    },
    category: "fun",
    interval: 5 * 60 * 1000, // 5 minutes interval
  },
  onStart: async function ({ api, event, usersData }) {
    const { loadImage, createCanvas } = require("canvas");
    let pathImg = __dirname + "/assets/farting.png";
    let pathAvt1 = __dirname + "/assets/avt1.png";
    let pathAvt2 = __dirname + "/assets/avt2.png";

    const threadInfo = await api.getThreadInfo(event.threadID);
    const allMembers = threadInfo.userInfo;

    // Select two random members for the funny scenario
    const [member1, member2] = getRandomMembers(allMembers, 2);

    const id1 = member1.id;
    const name1 = member1.name;

    const id2 = member2.id;
    const name2 = member2.name;

    // Load images and create canvas
    let baseImage = await loadImage("https://i.ibb.co/RBRLmRt/Pics-Art-05-14-10-47-00.jpg");
    let baseAvt1 = await loadImage(`https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    let baseAvt2 = await loadImage(`https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);

    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvt1, 111, 175, 330, 330);
    ctx.drawImage(baseAvt2, 1018, 173, 330, 330);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvt1);
    fs.removeSync(pathAvt2);
return api.sendMessage({
      body: `Breaking News! ${name1} and ${name2} caught farting at each other's face! 💨😂`,
      mentions: [
        { tag: `${name1}`, id: id1 },
        { tag: `${name2}`, id: id2 },
      ],
      attachment: fs.createReadStream(pathImg),
    },
    event.threadID,
    () => fs.unlinkSync(pathImg),
    event.messageID);
  },
};

function getRandomMembers(members, count) {
  const shuffled = members.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}