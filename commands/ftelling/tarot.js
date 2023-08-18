const bot = require('wheat-better-cmd');
const { AttachmentBuilder, Message, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const gm = require('gm');

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
 * @param {Message} obj.message 
 * @param {ChatInputCommandInteraction} obj.interaction
 */

const run = async ({ message, interaction, args, lg }) => {
	message = message || interaction;
	const tarotMeaning = await bot.wheatReadJSON('./assets/content/tarotMeaning.json');
	const randomCard = tarotMeaning[Math.floor(Math.random() * 78) + 1];
	const reversed = (args ? ((args.length > 1 && args[1] === 'r') ? true : false) : (interaction.options.getBoolean('reversed') || true));
	const type = (reversed === 1 ? bot.wheatRandomNumberBetween(0, 1) : 0);

	const embed = bot.wheatSampleEmbedGenerate();
	embed.setAuthor({ name: `⁘ ${message.member.displayName}, ${lg.fortune.yourTarotCardIs} ...` });
	embed.setTitle(`<a:t_v3:1140505323438874664> ** ${randomCard.name} ${reversed ? (type ? 'Xuôi' : 'Ngược') : ''}!**`);
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
	bot.wheatEmbedAttachFilesSend(message, [embed], [attachment]);
}

module.exports.run = run;

module.exports.help = help;