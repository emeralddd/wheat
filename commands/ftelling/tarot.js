const bot = require('wheat-better-cmd');
const databaseManager = require('../../modules/databaseManager');
const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { Request } = require('../../structure/Request');
const { loadImage, createCanvas } = require('@napi-rs/canvas');
const { join } = require('path');

const CanvasImages = {
	r: [],
	u: []
};

const readTarotImages = async () => {
	for (let i = 1; i <= 78; i++) {
		CanvasImages.r.push(await loadImage(join(__dirname, `/../../assets/image/tarotImage/r/${i}.png`)));
		CanvasImages.u.push(await loadImage(join(__dirname, `/../../assets/image/tarotImage/u/${i}.png`)));
	}
}

readTarotImages();

const pickTarotCards = (amount, rev) => {
	const pickList = [];

	while (pickList.length !== amount) {
		const randomCard = Math.floor(Math.random() * 78);
		if (!pickList.includes(randomCard)) {
			pickList.push(randomCard);
		}
	}

	return pickList.map(c => {
		return [c + 1, (rev ? Math.floor(Math.random() * 2) : 1)]
	});
}

const help = {
	name: "tarot",
	group: "ftelling",
	aliases: [],
	example: ["", " r", " nr 3", " c"],
	data: new SlashCommandBuilder()
		.addBooleanOption(option =>
			option.setName('reversed')
				.setDescription('use reversed card?')
				.setDescriptionLocalization('vi', 'cho phép bốc bài ngược?')
				.setRequired(false)
		)
		.addStringOption(option =>
			option.setName('spread')
				.setDescription('which tarot spread do you want?')
				.setDescriptionLocalization('vi', 'trải bài mà bạn muốn?')
				.setRequired(false)
				.addChoices(
					{ name: 'Trải 1 lá (One card spread)', value: '1' },
					{ name: 'Trải 3 lá (Three cards spread)', value: '3' },
					{ name: 'Trải 5 lá (Five cards spread)', value: '5' },
					{ name: 'Trải Celtic Cross (Celtic Cross spread)', value: 'c' }
				)
		)
}

/**
 * @param {object} obj
 * @param {Request} obj.request 
 */

const run = async ({ request, args, t }) => {
	const tarotMeaning = await bot.wheatReadJSON('./assets/content/tarotMeaning.json');

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

	let speard = 1;

	if (request.isMessage) {
		const speardArgs = (args[1] === 'r' || args[1] === 'nr') ? args[2] : args[1];

		if (speardArgs) {
			if (speardArgs === '3') {
				speard = 3;
			} else if (speardArgs === '5') {
				speard = 5;
			} else if (speardArgs === 'c') {
				speard = 'c';
			}
		}
	} else {
		const speardOpt = request.interaction.options.getString('spread');

		if (speardOpt) {
			if (speardOpt === '3') {
				speard = 3;
			} else if (speardOpt === '5') {
				speard = 5;
			} else if (speardOpt === 'c') {
				speard = 'c';
			}
		}
	}

	const embed = bot.wheatSampleEmbedGenerate();

	if (speard === 1) {
		const [[cardId, type]] = pickTarotCards(1, reversed);
		const tarotCard = tarotMeaning[cardId];

		embed.setAuthor({
			name: t('tarot.yourTarotCardIs', {
				user: request.member.displayName
			})
		});

		embed.setTitle(`<a:t_v3:1140505323438874664> ** ${tarotCard.name} ${reversed ? (type ? t('tarot.uprightCard') : t('tarot.reverseCard')) : ''}!**`);
		embed.setDescription(tarotCard.type === '1' ? t('tarot.majorArcana') : t('tarot.minorArcana'));

		embed.addFields({
			name: t('tarot.keywords'),
			value: type ? tarotCard.keywords : tarotCard.reKeywords
		});

		for (let i = 0; i < tarotCard.description.length; i++) {
			embed.addFields({
				name: (i === 0 ? t('tarot.cardDescription') : '▿'),
				value: tarotCard.description[i]
			});
		}

		const meaning = type ? tarotCard.meaning : tarotCard.reMeaning;

		for (let i = 0; i < meaning.length; i++) {
			embed.addFields({
				name: (i === 0 ? t('tarot.meaning') : '▿'),
				value: meaning[i]
			});
		}

		const attachment = new AttachmentBuilder(`./assets/image/tarotImage/${type ? 'u' : 'r'}/${tarotCard.image}`, tarotCard.image);
		embed.setImage(`attachment://${tarotCard.image}`);
		request.reply({ embeds: [embed], files: [attachment] });
	} else if (speard === 3 || speard === 5) {
		const tarotCards = pickTarotCards(speard, reversed);

		const gap = 50;

		const canvas = createCanvas(293 * speard + gap * (speard - 1), 512);
		const ctx = canvas.getContext('2d');

		for (let i = 0; i < tarotCards.length; i++) {
			ctx.drawImage(CanvasImages[tarotCards[i][1] ? 'u' : 'r'][tarotCards[i][0] - 1], (293 + gap) * i, 0);
		}

		const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: `spreads.png` });
		embed.setImage(`attachment://spreads.png`);
		request.reply({ embeds: [embed], files: [attachment] });
	} else {
		const tarotCards = pickTarotCards(10, reversed);

		const canvas = createCanvas(1742, 2198);
		const ctx = canvas.getContext('2d');

		ctx.drawImage(CanvasImages[tarotCards[0][1] ? 'u' : 'r'][tarotCards[0][0] - 1], 453, 746); //1
		ctx.rotate(-90 * Math.PI / 180);

		ctx.drawImage(CanvasImages[tarotCards[1][1] ? 'u' : 'r'][tarotCards[1][0] - 1], -1451, 343); //2

		ctx.rotate(90 * Math.PI / 180);

		ctx.drawImage(CanvasImages[tarotCards[2][1] ? 'u' : 'r'][tarotCards[2][0] - 1], 0, 746); //3
		ctx.drawImage(CanvasImages[tarotCards[3][1] ? 'u' : 'r'][tarotCards[3][0] - 1], 906, 746); //4
		ctx.drawImage(CanvasImages[tarotCards[4][1] ? 'u' : 'r'][tarotCards[4][0] - 1], 453, 184); //5
		ctx.drawImage(CanvasImages[tarotCards[5][1] ? 'u' : 'r'][tarotCards[5][0] - 1], 453, 1501); //6
		ctx.drawImage(CanvasImages[tarotCards[6][1] ? 'u' : 'r'][tarotCards[6][0] - 1], 1449, 0); //7
		ctx.drawImage(CanvasImages[tarotCards[7][1] ? 'u' : 'r'][tarotCards[7][0] - 1], 1449, 562); //8
		ctx.drawImage(CanvasImages[tarotCards[8][1] ? 'u' : 'r'][tarotCards[8][0] - 1], 1449, 1124); //9
		ctx.drawImage(CanvasImages[tarotCards[9][1] ? 'u' : 'r'][tarotCards[9][0] - 1], 1449, 1686); //10

		const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: `spreads.png` });
		embed.setImage(`attachment://spreads.png`);
		request.reply({ embeds: [embed], files: [attachment] });
	}
}

module.exports.run = run;

module.exports.help = help;