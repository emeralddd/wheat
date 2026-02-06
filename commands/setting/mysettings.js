const bot = require('wheat-better-cmd');
const { SlashCommandBuilder, ActionRow, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const databaseManager = require('../../modules/databaseManager');
const { Request } = require('../../structure/Request');
require('dotenv').config({ path: 'secret.env' });

const help = {
    name: "mysettings",
    group: "setting",
    aliases: ["ms"],
    example: [""],
    rate: 2000
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, t }) => {
    const embed = bot.wheatSampleEmbedGenerate();
    const memberId = request.member.id;
    const find = await databaseManager.getMember(memberId);

    embed.setTitle(t('mysettings.title'));
    embed.setDescription(t('mysettings.description'));

    embed.addFields({
        name: t('mysettings.overview'),
        value: `${t('mysettings.language')}:  **${find.language ? t(`main.thisLanguage`) : t('main.unset')}**\n`
    });

    embed.addFields({
        name: t('mysettings.tarot'),
        value: 
            `${t('mysettings.applyTarotReversed')}:  **${find.tarot ? t('main.yes') : t('main.no')}**\n`+
            `${t('mysettings.hideTarotMeaning')}:  **${find.hideTarotMeaning ? t('main.yes') : t('main.no')}**\n`
    });

    const options = new StringSelectMenuBuilder()
        .setCustomId('mysettings.update')
        .setPlaceholder(t('mysettings.selectPlaceholder'))
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel(t('mysettings.languageSetting'))
                .setValue('language'),
            new StringSelectMenuOptionBuilder()
                .setLabel(t('mysettings.tarotReversedSetting'))
                .setValue('reversedTarot'),
            new StringSelectMenuOptionBuilder()
                .setLabel(t('mysettings.hideTarotMeaningSetting'))
                .setValue('hideTarotMeaning')

        );

    const row = new ActionRowBuilder()
        .addComponents(options);

    await request.reply({ embeds: [embed], components: [row] });
}

module.exports.run = run;

module.exports.help = help;