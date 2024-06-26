const { SlashCommandBuilder } = require('discord.js');
const { Request } = require('../../structure/Request');

const help = {
	name: "pick",
	group: "random",
	aliases: ["choose", "chon"],
	data: new SlashCommandBuilder()
		.addStringOption(option =>
			option.setName('choices')
				.setDescription('<choice 1>,<choice 2>,[choice 3],[choice 4],...,[choice n]')
				.setRequired(true)
		)
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String} obj.msg
 * @param {String} obj.prefix
 */

const run = async ({ msg, request, prefix, lg }) => {
	let ls = "";
	if (request.isMessage) {
		ls = msg.substring(prefix.length);
		for (let i = 0; i < ls.length; i++) {
			const now = ls[i] + ls[i + 1] + ls[i + 2] + ls[i + 3];
			if (now.toUpperCase() === 'PICK') {
				ls = ls.substring(i + 4);
				break;
			}
		}
	} else {
		ls = request.interaction.options.getString('choices');
	}

	ls += ',';

	let temp = " ";
	let list = [];

	for (let i of ls) {
		if (i !== ',') temp += i;
		else {
			list.push(temp.trim());
			temp = " ";
		}
	}

	if (list.length < 2) {
		await request.reply(lg.error.atLeast2Options);
		return;
	}

	let item = list[Math.floor(Math.random() * list.length)];
	if (item === "") item = " ";
	await request.reply(`${lg.random.iPick}: **${item}**`);
}

module.exports.run = run;

module.exports.help = help;