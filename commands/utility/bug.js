const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const bot = require('wheat-better-cmd');
const { Request } = require('../../structure/Request');

const help = {
    name: "bug",
    group: "utility",
    aliases: ["report", "baocao", "loi"]
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 */

const run = async ({ request, t }) => {
    const embed = bot.wheatSampleEmbedGenerate();
    embed.setTitle(t('main.reportBotError'));
    embed.setDescription(t('main.clickLinkToReport'));
    const link = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel(t('main.clickHere'))
                .setStyle(ButtonStyle.Link)
                .setURL('https://docs.google.com/forms/d/1QOYrbwJqjZHZElWbq7FIb5HEzsRPJN-PBxx_5hiv5nQ/viewform?edit_requested=true')
                .setEmoji('🐛')
        );
    request.reply({ embeds: [embed], components: [link] });
}

module.exports.run = run;

module.exports.help = help;