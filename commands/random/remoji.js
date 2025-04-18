const bot = require('wheat-better-cmd');
const { Client } = require('discord.js');
const { Request } = require('../../structure/Request');

const help = {
    name: "remoji",
    group: "random",
    aliases: ["re", "emoji", "randomemoji"]
}

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Request} obj.request
 */

const run = async ({ wheat, request, t }) => {
    const embed = bot.wheatSampleEmbedGenerate();
    const emoji = wheat.emojis.cache.random();

    embed.setTitle(`Random Emoji`);
    embed.setDescription(`<${emoji.animated ? `` : `:`}${emoji.identifier}>\n${t('main.name')}: ${emoji.name}\nID: ${emoji.id}\nServer: ${emoji.guild.name}\nAnimated: ${emoji.animated ? t('main.yes') : t('main.no')}\nCode: ` + "`" + emoji.identifier + "`" + (emoji.author ? `${t('main.addedBy')}: ${emoji.author.username}` : ``));
    await request.reply({ embeds: [embed] });
}

module.exports.run = run;

module.exports.help = help;