const bot = require('wheat-better-cmd');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Request } = require('../../structure/Request');

const help = {
    name: "support",
    group: "utility",
    aliases: ["hotro"]
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 */

const run = async ({ request, t }) => {
    const embed = bot.wheatSampleEmbedGenerate();
    embed.setAuthor({ name: `Wheat#1261`, iconURL: process.env.AVATAR });
    embed.setTitle(t('main.needHelp'));
    embed.setDescription(t('main.supportDetails'));
    embed.addFields(
        {
            name: t('main.dmDeveloper'),
            value: `<@687301490238554160>`,
            inline: true
        }
    );
    const button = new ButtonBuilder()
        .setLabel(t('main.submitTicket'))
        .setStyle(ButtonStyle.Link)
        .setURL('https://docs.google.com/forms/d/1EwycxNOkf0lJasyiyDj6G1AT9CDSJtvcLwYTcF9dk9c/viewform?edit_requested=true')
        .setEmoji('🎟️');

    const join2 = new ButtonBuilder()
        .setLabel(t('main.supportServer'))
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.gg/z5Z4uzmED9')
        .setEmoji('947096157316862023');

    const link = new ActionRowBuilder()
        .addComponents([button, join2]);

    await request.reply({ embeds: [embed], components: [link] });
}

module.exports.run = run;

module.exports.help = help;