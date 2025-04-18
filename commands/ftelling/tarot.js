const bot = require('wheat-better-cmd');
const databaseManager = require('../../modules/databaseManager');
const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { Request } = require('../../structure/Request');
const { loadImage, createCanvas } = require('@napi-rs/canvas');
const { join } = require('path');


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

	let spread = 1;

	if (request.isMessage) {
		const spreadArgs = (args[1] === 'r' || args[1] === 'nr') ? args[2] : args[1];

		if (spreadArgs) {
			if (spreadArgs === '3') {
				spread = 3;
			} else if (spreadArgs === '5') {
				spread = 5;
			} else if (spreadArgs === 'c') {
				spread = 'c';
			}
		}
	} else {
		const spreadOpt = request.interaction.options.getString('spread');

		if (spreadOpt) {
			if (spreadOpt === '3') {
				spread = 3;
			} else if (spreadOpt === '5') {
				spread = 5;
			} else if (spreadOpt === 'c') {
				spread = 'c';
			}
		}
	}

	const embed = bot.wheatSampleEmbedGenerate();

	if (spread === 1) {
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
	} else if (spread === 3 || spread === 5) {
		const tarotCards = pickTarotCards(spread, reversed);

		const gap = 50;

		const canvas = createCanvas(293 * spread + gap * (spread - 1), 512);
		const ctx = canvas.getContext('2d');



		for (let i = 0; i < tarotCards.length; i++) {
			const tarotCanvas = await loadImage(join(__dirname, `/../../assets/image/tarotImage/${tarotCards[i][1] ? 'u' : 'r'}/${tarotCards[i][0]}.png`));

			ctx.drawImage(tarotCanvas, (293 + gap) * i, 0);
		}

		embed.setTitle(t('tarot.35cards', {
			user: request.member.displayName,
			num: spread
		}));

		embed.addFields({
			name: t('tarot.lefttoright'),
			value: tarotCards.map((card, ind) => `${ind + 1}. **${tarotMeaning[card[0]].name}** ${reversed ? (card[1] ? t('tarot.uprightCard') : t('tarot.reverseCard')) : ''}`).join('\n')
		});

		const attachment = new AttachmentBuilder(canvas.toBuffer('image/webp'), { name: `spreads.png` });
		embed.setImage(`attachment://spreads.png`);
		request.reply({ embeds: [embed], files: [attachment] });
	} else {
		const tarotCards = pickTarotCards(10, reversed);

		const canvas = createCanvas(1742, 2198);
		const ctx = canvas.getContext('2d');

		ctx.font = '60px sans-serif';
		ctx.fillStyle = '#ffffff';
		ctx.textBaseline = "hanging";

		const coordOfCards = [[453, 746], [-1451, 343], [0, 746], [906, 746], [453, 184], [453, 1501], [1449, 0], [1449, 562], [1449, 1124], [1449, 1686]];

		for (let i = 1; i <= 10; i++) {
			if (i === 2) {
				ctx.rotate(-90 * Math.PI / 180);
			}

			const tarotCanvas = await loadImage(join(__dirname, `/../../assets/image/tarotImage/${tarotCards[i - 1][1] ? 'u' : 'r'}/${tarotCards[i - 1][0]}.png`))

			ctx.drawImage(tarotCanvas, coordOfCards[i - 1][0], coordOfCards[i - 1][1]);

			ctx.fillStyle = '#fff';
			ctx.fillRect(coordOfCards[i - 1][0], coordOfCards[i - 1][1], i === 10 ? 80 : 40, 50);

			ctx.fillStyle = '#edc809';
			ctx.fillText('' + i, coordOfCards[i - 1][0] + 3, coordOfCards[i - 1][1] + 3);

			if (i === 2) {
				ctx.rotate(90 * Math.PI / 180);
			}
		}

		const attachment = new AttachmentBuilder(canvas.toBuffer('image/webp'), { name: `spreads.png` });

		embed.setTitle(t('tarot.celtic', {
			user: request.member.displayName
		}));

		embed.addFields({
			name: t('tarot.celticList'),
			value: tarotCards.map((card, ind) => `${ind + 1}. **${tarotMeaning[card[0]].name}** ${reversed ? (card[1] ? t('tarot.uprightCard') : t('tarot.reverseCard')) : ''}`).join('\n')
		});

		embed.setImage(`attachment://spreads.png`);
		request.reply({ embeds: [embed], files: [attachment] });
	}
}

module.exports.run = run;

module.exports.help = help;