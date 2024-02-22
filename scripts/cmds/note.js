const { getStreamsFromAttachment, checkAndTranslate } = global.utils;

module.exports = {
	config: {
		name: "note",
		aliases: ["notice"],
		version: "69",
		author: "SKY",
		countDown: 5,
		role: 2,
		shortDescription: "Send notice from admin to a specific group",
		longDescription: "Send notice from admin to a specific group",
		category: "owner",
		guide: "{pn} <group ID or name> <message>",
		envConfig: {
			delayPerGroup: 250
		}
	},

	onStart: async function ({ message, api, event, args, commandName, envCommands }) {
		const { delayPerGroup } = envCommands[commandName];
		const groupIdentifier = args.shift(); // Extract group ID or name from arguments
		const noticeMessage = args.join(" ");

		if (!groupIdentifier || !noticeMessage) {
			return message.reply("Please provide both the group ID or name and the message you want to send.");
		}

		const groups = await api.getThreadList(200, null, ["INBOX"]);

		const targetGroup = groups.find(group => group.threadID === groupIdentifier || group.name === groupIdentifier);

		if (!targetGroup) {
			return message.reply("The specified group ID or name is not valid or the bot is not a member of that group.");
		}

		const formSend = {
			body: `\n\n${noticeMessage}`,
			attachment: await getStreamsFromAttachment([...event.attachments, ...(event.messageReply?.attachments || [])])
		};

		try {
			await api.sendMessage(formSend, targetGroup.threadID);
			message.reply(`✅ Sent notice to the group "${targetGroup.name}" successfully!`);
		} catch (error) {
			console.error(error);
			message.reply(`❌ Error occurred while sending notice to the group "${targetGroup.name}".`);
		}
	}
};