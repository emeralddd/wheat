const bot = require('wheat-better-cmd');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Request } = require('../../structure/Request');

const help = {
    name: "invite",
    group: "utility",
    aliases: ["inv"]
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 */

const run = async ({ request, t }) => {
    const embed = bot.wheatSampleEmbedGenerate(true);
    embed.setTitle(t('main.inviteBot'));
    embed.setDescription(t('main.inviteToGetBot'));

    const topgg = new ButtonBuilder()
        .setLabel(t('main.inviteTopgg'))
        .setStyle(ButtonStyle.Link)
        .setURL('https://top.gg/bot/798925450562764863');

    const direct = new ButtonBuilder()
        .setLabel(t('main.inviteDirectly'))
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.com/api/oauth2/authorize?client_id=786234973308715008&permissions=4294442871&scope=bot');

    const link = new ActionRowBuilder()
        .addComponents([topgg, direct]);

    await request.reply({ embeds: [embed], components: [link] });
}

module.exports.run = run;

module.exports.help = help;