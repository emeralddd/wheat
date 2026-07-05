const bot = require('wheat-better-cmd');
const { SnowflakeUtil } = require('discord.js');
const { Request } = require('../../structure/Request');

const NO_CARDS = 78;

let tarotMeaning = {
	vi: null,
	en: null
};

const loadTarotMeaning = async (language) => {
	if (!tarotMeaning[language]) {
		tarotMeaning[language] = await bot.wheatReadJSON(`./assets/content/${language}/tarotMeaning.json`);
	}
}

module.exports = {
	name: "selectCardInSpread",
	/**
	 * @param {Request} request 
	 */
	async run(request, t) {
		await loadTarotMeaning(t('main.code'));

		if (!request.interaction.values || request.interaction.values.length === 0) return;

		const splitInteractionArray = request.interaction.values[0].split('.').map(item => Number(item));

		if (splitInteractionArray.length !== 3) return;

		const [cardId, reversed, type] = splitInteractionArray;

		if (cardId > NO_CARDS || cardId < 0) return;

		const tarotCard = tarotMeaning[t('main.code')][cardId];

		const embed = bot.wheatSampleEmbedGenerate();
		embed.setAuthor({
			name: t('tarot.thisCardMeaningIs')
		});

		embed.setTitle(`<a:t_v4:1140505547221766195> ** ${tarotCard.name} ${reversed ? (type ? t('tarot.uprightCard') : t('tarot.reverseCard')) : ''}**`);
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

		request.reply({
			embeds: [embed],
			ephemeral: true
		});
	}
}