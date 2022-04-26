const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')
require('dotenv').config

const help = {
    name:"angry",
    group:"fun",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message,lg}) => {
    const gifArray = require('../../assets/url/gifsURL.json').angry
    const embed = await bot.wheatSampleEmbedGenerate()
    embed.setTitle(`${message.member.displayName} ${lg.fun.angry}`)
    embed.setImage(bot.wheatRandomElementFromArray(gifArray))
    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help