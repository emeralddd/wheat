const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const databaseManager = require('../../modules/databaseManager');
const bot = require('wheat-better-cmd');
const { Request } = require("../../structure/Request");

module.exports = {
	name: "update",
	/**
	 * @param {Request} request 
	 */
	async run(request, t) {
		const option = request.interaction.values[0];
		const find = await databaseManager.getMember(request.interaction.member.id);

		const embeds = [];
		const components = [];

		if(option === 'hideTarotMeaning') {
			const embed = bot.wheatSampleEmbedGenerate()
				.setTitle(t('mysettings.confirmChange'))
				.setDescription(t('mysettings.hideTarotMeaningSettingDesc', {
					newSetting: find && find.hideTarotMeaning ? t('main.no') : t('main.yes')
				}));

			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`mysettings.confirmHideTarotMeaning`)
						.setLabel(t('mysettings.confirm'))
						.setStyle(ButtonStyle.Success)
				);

			embeds.push(embed);
			components.push(row);
		} else if (option === 'reversedTarot') {
			const embed = bot.wheatSampleEmbedGenerate()
				.setTitle(t('mysettings.confirmChange'))
				.setDescription(t('mysettings.tarotReversedSettingDesc', {
					newSetting: find && find.tarot ? t('main.no') : t('main.yes')
				}));

			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`mysettings.confirmReversedTarot`)
						.setLabel(t('mysettings.confirm'))
						.setStyle(ButtonStyle.Success)
				);

			embeds.push(embed);
			components.push(row);
		} else if(option === 'language') {
			const row = new ActionRowBuilder()
				.addComponents(
					new StringSelectMenuBuilder()
						.setCustomId(`mysettings.selectLanguage`)
						.setPlaceholder(t('mysettings.selectLanguagePlaceholder'))
						.addOptions(
							new StringSelectMenuOptionBuilder()
								.setLabel('Tiếng Việt')
								.setValue('vi'),
							new StringSelectMenuOptionBuilder()
								.setLabel('English')
								.setValue('en'),
							new StringSelectMenuOptionBuilder()
								.setLabel('Không sử dụng/Unset')
								.setDescription(t('mysettings.unsetDesc'))
								.setValue('unset')
						)
			);
			components.push(row);
		}

		request.reply({
			embeds: embeds.length > 0 ? embeds : undefined,
			components: components.length > 0 ? components : undefined,
			ephemeral: true
		});
	}
}