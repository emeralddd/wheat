const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')

const help = {
    name:"ping",
    group:"utility",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message,lg}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    embed.setDescription(`**Pong! ${lg.main.in} ` + String(new Date().getTime() - message.createdTimestamp ) + ` ${lg.main.miliseconds}!**`)
    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help