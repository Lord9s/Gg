const axios = require('axios');

module.exports = {
  config: {
    name: "ronaldoedit",
    aliases: ["redit"],
    version: "2.0",
    author: "Dee Pam & Kshitiz",
    countDown: 10,
    role: 0,
    shortDescription: "",
    longDescription: "bot will send you ronaldo edits 🐐",
    category: "EDIT",
    guide: "{p}redit",
  },

  sentVideos: [],

  onStart: async function ({ api, event, message }) {
    const senderID = event.senderID;

    const loadingMessage = await message.reply({
      body: "sending goat edit video 🐐..",
    });

    const driveLinks = [
      "https://drive.google.com/file/d/12of_p-SWD0TH-M7hXXi3Ye8bIa7fEJ0L/view?usp=drivesdk",
      "https://drive.google.com/file/d/13AAOpLAR9QyeFFc74gGpNzuYWiC87Z4r/view?usp=drivesdk",

"https://drive.google.com/file/d/13A9TDdqX6gqrF7Oq5_f0fT6MmlGSgdDH/view?usp=drivesdk",

"https://drive.google.com/file/d/13A9TDdqX6gqrF7Oq5_f0fT6MmlGSgdDH/view?usp=drivesdk",

"https://drive.google.com/file/d/13jXd8h6nXNXMrr0xB3e1qun4onnyd92n/view?usp=drivesdk",

"https://drive.google.com/file/d/13nGQBo1XAFACSMQfTJuzZdJzuJScXPgl/view?usp=drivesdk",

"https://drive.google.com/file/d/13vsQmEWsfrfbYaUzwgVPwtRtHLGAtfY4/view?usp=drivesdk",

"https://drive.google.com/file/d/140VEMfQXDv-6V5MNuOGY6aoicvku-Y1I/view?usp=drivesdk",

"https://drive.google.com/file/d/140h5pA4IgQrjisWlWtZrPIm53sHkWYEB/view?usp=drivesdk",

"https://drive.google.com/file/d/141q_3pbXxmfyyPZnCNxdwyBhh27XRGyh/view?usp=drivesdk",

"https://drive.google.com/file/d/146TlTTLmKqrn6hpnSZP4i4dZI1Ua5qeC/view?usp=drivesdk",

"https://drive.google.com/file/d/149UhUV-AvFzVkwKIjOQsQlPiy7jfMsZ1/view?usp=drivesdk",

"https://drive.google.com/file/d/14HuP7vqZkjMwLzJQ9NHUVNjoxJ1j4dr7/view?usp=drivesdk",

"https://drive.google.com/file/d/14hkB9krPG-8Jl7B1PL2c4BblcAGSX0C5/view?usp=drivesdk",

"https://drive.google.com/file/d/14yEmy8-TnkvVwy4DWdatSt6W8bhCtgib/view?usp=drivesdk",

"https://drive.google.com/file/d/15WAN3PTtVxUt7HAlu6W-PvQCOagcEM75/view?usp=drivesdk",

"https://drive.google.com/file/d/15a9_8JLcjtW4mRGbbd79lofy_HoD9wtk/view?usp=drivesdk",

"https://drive.google.com/file/d/15ezzhK4YOD3Js1Mn9YsXhmLrcVrk3d07/view?usp=drivesdk",

"https://drive.google.com/file/d/15VXnHyVX4YXMKJ7KYseAR9o3Hy2mAAVl/view?usp=drivesdk",

"https://drive.google.com/file/d/15lz-2mrMMmViSdavBT-YoCKGNE7Fg7JU/view?usp=drivesdk",

"https://drive.google.com/file/d/15jEjhdcxeCIzBadNWLXUON950U0KyMvO/view?usp=drivesdk",

"https://drive.google.com/file/d/15k_FOg91MO6xZnUtXby1kolaGUb5Ie0q/view?usp=drivesdk",



 
   ];


    const availableVideos = driveLinks.filter(video => !this.sentVideos.includes(video));

    if (availableVideos.length === 0) {
      this.sentVideos = [];
    }

    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    const randomDriveLink = availableVideos[randomIndex];


    const fileId = randomDriveLink.match(/\/d\/(.+?)\//)[1];


    const downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;

    this.sentVideos.push(randomDriveLink);

    if (senderID !== null) {
      try {
        const response = await axios({
          method: 'GET',
          url: downloadLink,
          responseType: 'stream',
        });

        message.reply({
          body: 'Goat Arrived 🐐🫶🏼',
          attachment: response.data,
        });

        setTimeout(() => {
          api.unsendMessage(loadingMessage.messageID);
        }, 10000);
      } catch (error) {
        console.error('Error downloading video:', error);
        message.reply({
          body: 'Error downloading the video. Please try again later.',
        });
      }
    }
  },
};