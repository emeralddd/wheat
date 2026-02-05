const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SnowflakeUtil, ButtonInteraction } = require("discord.js");
const databaseManager = require('../../modules/databaseManager');
const bot = require('wheat-better-cmd');
const { Request } = require("../../structure/Request");

module.exports = {
	name: "confirmHideTarotMeaning",
	/**
	 * @param {Request} request 
	 */
	async run(request, t) {
        const memberId = request.interaction.member.id;
        const find = await databaseManager.getMember(memberId);
        const embed = bot.wheatSampleEmbedGenerate();

		try {
            if (find.id) {
                await databaseManager.updateMember(memberId, {
                    hideTarotMeaning: find.hideTarotMeaning ? 0 : 1
                });
            } else {
                await databaseManager.newMember(memberId, {
                    hideTarotMeaning: 1
                });
            }
    
            embed.setTitle(t('main.successExecution'));
            embed.setDescription(t('main.successHideTarotMeaning'));
            await request.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            await request.reply(t('error.undefinedError'));
        }
	}
}