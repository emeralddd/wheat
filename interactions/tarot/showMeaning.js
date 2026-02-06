const bot = require('wheat-better-cmd');
const { Request } = require('../../structure/Request');
const interactionDataBase = require('../../modules/interactionDataBase');

const NO_CARDS = 78;

module.exports = {
    name: "showMeaning",
    /**
     * @param {Request} request 
     */
    async run(request, t) {
        if (!request.interactionDataId) {
            return request.reply({
                message: t('error.unableToGetCardData'),
                ephemeral: true
            });
        }
        
        const data = interactionDataBase.get(request.interactionDataId);
        if (!data) {
            return request.reply({
                content: t('error.interactionExpired'),
                ephemeral: true
            });
        }

        const {cardId, reversed, type} = data;

        if (cardId > NO_CARDS || cardId < 0) return;

        const tarotMeaning = await bot.wheatReadJSON(`./assets/content/${t('main.code')}/tarotMeaning.json`);
        const tarotCard = tarotMeaning[cardId];

        const embed = bot.wheatSampleEmbedGenerate();
        embed.setFooter({ text: request.language==='en'?'To show/hide meaning by default when drawing cards, use the /mysettings command.\n**Note: This English version of Tarot Meaning is in experimental stage and may contain inaccuracies due to automatic translation by GenAI. We are working on enhancing the quality of the translation. **':'Để mặc định ẩn/hiện ý nghĩa khi bốc bài, sử dụng lệnh /mysettings.' });
        embed.setTitle(`${request.language==='vi'?'<a:t_v4:1140505547221766195>':''} ** ${tarotCard.name} ${reversed ? (type ? t('tarot.uprightCard') : t('tarot.reverseCard')) : ''}**`);
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