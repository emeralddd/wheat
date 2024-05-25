const bot = require('wheat-better-cmd');
const { Request } = require('../../structure/Request');
require('dotenv').config;

const help = {
    name: "sleepy",
    group: "fun",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 */

const run = async ({ request, lg }) => {
    const gifArray = require('../../assets/url/gifsURL.json').sleepy;
    const embed = bot.wheatSampleEmbedGenerate();
    embed.setTitle(`${request.member.displayName} ${lg.fun.sleepy}`);
    embed.setImage(bot.wheatRandomElementFromArray(gifArray));
    await request.reply({ embeds: [embed] });
}

module.exports.run = run;

module.exports.help = help;