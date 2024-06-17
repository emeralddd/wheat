const bot = require('wheat-better-cmd');
const databaseManager = require('../../modules/databaseManager');
const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { Request } = require('../../structure/Request');

const help = {
	name: "tarot",
	group: "ftelling",
	aliases: [],
	data: new SlashCommandBuilder()
		.addBooleanOption(option =>
			option.setName('reversed')
				.setDescription('use reversed card?')
				.setRequired(false)
		)
}

/**
 * @param {object} obj
 * @param {Request} obj.request 
 */

const run = async ({ request, args, lg }) => {
	const tarotMeaning = await bot.wheatReadJSON('./assets/content/tarotMeaning.json');

	const randomCard = tarotMeaning[Math.floor(Math.random() * 78) + 1];

	const memberId = request.member.id;

	let reversed = false;

	const find = await databaseManager.getMember(memberId);
	if (find && find.tarot) {
		reversed = true;
	}

	//r: reversed
	//nr: no reverse

	if (request.isMessage ? (args.length > 1) : request.interaction.options.getBoolean('reversed') !== null) {
		if (request.isInteraction ? request.interaction.options.getBoolean('reversed') : args[1] === 'r') {
			reversed = true;
		}

		if (request.isInteraction ? !request.interaction.options.getBoolean('reversed') : args[1] === 'nr') {
			reversed = false;
		}
	}

	const type = (reversed ? Math.floor(Math.random() * 2) : 1);

	const embed = bot.wheatSampleEmbedGenerate();
	embed.setAuthor({ name: `⁘ ${request.member.displayName}, ${lg.fortune.yourTarotCardIs} ...` });
	embed.setTitle(`<a:t_v3:1140505323438874664> ** ${randomCard.name} ${reversed ? (type ? 'xuôi' : 'ngược') : ''}!**`);
	embed.setDescription(randomCard.type === '1' ? lg.fortune.majorArcana : lg.fortune.minorArcana);

	embed.addFields({
		name: lg.fortune.keywords,
		value: type ? randomCard.keywords : randomCard.reKeywords
	});

	for (let i = 0; i < randomCard.description.length; i++) {
		embed.addFields({
			name: (i === 0 ? lg.fortune.cardDescription : '▿'),
			value: randomCard.description[i]
		});
	}

	const meaning = type ? randomCard.meaning : randomCard.reMeaning;

	for (let i = 0; i < meaning.length; i++) {
		embed.addFields({
			name: (i === 0 ? lg.fortune.meaning : '▿'),
			value: meaning[i]
		});
	}

	const attachment = new AttachmentBuilder(`./assets/image/tarotImage/${type ? 'u' : 'r'}/${randomCard.image}`, randomCard.image);
	embed.setImage(`attachment://${randomCard.image}`);
	request.reply({ embeds: [embed], files: [attachment] });
}

module.exports.run = run;

module.exports.help = help;