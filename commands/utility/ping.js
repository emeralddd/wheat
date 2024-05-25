const bot = require('wheat-better-cmd');
const { Request } = require('../../structure/Request');

const help = {
    name: "ping",
    group: "utility",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Request} obj.request

 */

const run = async ({ request, lg }) => {
    const embed = bot.wheatSampleEmbedGenerate();
    embed.setDescription(`**Pong! ${lg.main.in} ` + String(new Date().getTime() - request.createdTimestamp) + ` ${lg.main.miliseconds}!**`);

    await request.reply({ embeds: [embed] });
}

module.exports.run = run;

module.exports.help = help;