const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "FACiBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACD0wAB6NxlxIYAS9+wqCoLU61VdfFxty/HFwiEjlMQbtUfQeRd5//0r6Roi4Ga/C/BKi+ms8N8s2EAGPgfDuEbihydRwJJzGtvWDpCHuLqgSrng1hcsKLWz537aMBp51KAb1ERYkIVtnTTvBrVa3iV7XeqpX8ixP2BjZ0qxKtRy/jd0eztZzcnqjH3S3j/WowwrUN15cY09iyLsfFWstrizEyMcmuYTnVDIxy2VWOe1T2Oc97LlorXbei5RvLC7jRFDXeWRKqtKgG4PHMoXtrQR31NQov8WHnU7TArvrpdzK8ByBWi66eI7SsHFldESKR9H3ScZiBvzxO3jOKKVwvrag7xW4hbaU4p0IoN0M70HU0mscaHp4iz73pw5q9sND03jHUtWg+lr4qavg7uL9BDAB1mijnaKReJHzWxw25HKn08k3A8m6rxIKDGOvOAO2g77KcZx5XCrVkeaAJLjVx2Qj13Djr/kR3VvCXUEY85pmuRlj1IQgdKcrjv78AiQx6t1P0yfMIsujpA5qss6gqrcLMSnl9VMLMmITjbkSFLAidphLFalWZXJtUjn6nTgWGVTJ2M3i99SQe51hz1jAWpljjslqXJCsyyhVsgt7RlTXy+q0gec6YrhRodqAhE6BaiICEx5Fzi/MSQnKh2nbVCA9O0RXXp2OrC1vIcmzjpOXFj9XaKMCX+02aDyFtwCYSWipoz0Bw9JWBdoi7b4QgIS5SgObEXbxOXRERjPZknbAuVxa6Zl6YZFYcdlLGVenK/6UGT08PxlC9GNvWIj27K3dPH0QOllneZeWsiaqSGiSo6A4FxLuGCqri49E75+klNre3T5fNueRJzd2yeuiYu4K66zfUzbFO9AuXtBchCF4TGXhYQbMNQXWEc5VKrqRcJvUnNrNL4EeRigPDopB12lfDZyUNevSTC+OD18J5XnPvjJBk1v2hNZE45z+r4/uoPFPECbqR/9hgoeo3NrCicAdckLATexoyr/eYnGsCeJFkeS6i9Jgy8AgoDRC/NMHRmb8jf2O/6nHywEJBq4i3O4SxdNgc/gZJ0sefTVVjPzBPenKkZkDawKItq7zLSugRtFZUuGZPeEc2B9ZzaUld3QcC/O82tnYx5IbRpta0/w2XCa83BpTrDSRemoBIsLQzPYQVcLo5L6YJPSYS+eQz1QIC0orIYeULcM1djDRjhNkvRUeTKUday35qu3ihDYYSvKyKVSUttLJQe4iFEClAZjkP6AFzEYVkkV/peIKsI013aAlVqXWPuLJT4KQgz431TztOS48odvEqdIcwXr9dQRYHXGELLzzvA5dGGAmECprq7DQe9LVa+1wAHaNxVqSp9kDLycQOhooTKRGwE1aILKXjpAZ56BKkXInzcD2uETkz73wXer1OeU9+BkJnST4CDmw9CuCFb+ksKQfiNqUNDPeE5fP9lFhu0Hc3esy53gpFtd7A2I+lKG3ccslkb3TgcfRSYB1b2bCXzMhSn+AGb8if1MZwoAIxhbgFAAEtVkjqz9LrPD42qwnPeYozVH4cw==";
const _U = "1E2vtTKR0FVflIa25ajkppVriLf7KRWF_e6Wlb4hhOdy-MQ9FqZriLPP2TKpbAfHz_ikFgMNnL_2Ac4OH0w2-QiAdq-6Epjjrk3SL5Z-MHTjHxMd3bE-hL35s0y0l_Q69I_fQgGpz68ahKNTgJU3NvEY1BvdSYgV4QiQVDsU3PHmQJuPq5piq1a-3VQdZojATCQMITBSLo_tdaYk__pHli5xsJ-I5axRUrO1ZHqAj5dM";
module.exports = {
  config: {
    name: "dalle",
    aliases: ["dalle3"],
    version: "1.0.2",
    author: "Samir Œ ",
    role: 0,
    countDown: 5,
    shortDescription: {
      en: "dalle"
    },
    longDescription: {
      en: ""
    },
    category: "dalle",
    guide: {
      en: "{prefix}dalle <search query> -<number of images>"
    }
  },

  onStart: async function ({ api, event, args }) {

const uid = event.senderID
    const permission = [`${uid}`];
    if (!permission.includes(event.senderID)) {
      api.sendMessage(
        "You don't have enough permission to use this command. Only admin can do it.",
        event.threadID,
        event.messageID
      );
      return;
    }

    const keySearch = args.join(" ");
    const indexOfHyphen = keySearch.indexOf('-');
    const keySearchs = indexOfHyphen !== -1 ? keySearch.substr(0, indexOfHyphen).trim() : keySearch.trim();
    const numberSearch = parseInt(keySearch.split("-").pop().trim()) || 4;

    try {
      const res = await axios.get(`https://api-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(keySearchs)}`);
      const data = res.data.results.images;

      if (!data || data.length === 0) {
        api.sendMessage("No images found for the provided query.", event.threadID, event.messageID);
        return;
      }

      const imgData = [];
      for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
        const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
        const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage({
        attachment: imgData,
        body: `Here's your generated image`
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage("cookie of the command. Is expired", event.threadID, event.messageID);
    } finally {
      await fs.remove(path.join(__dirname, 'cache'));
    }
  }
};