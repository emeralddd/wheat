const { Message } = require('discord.js');
const bot = require('wheat-better-cmd')
require('dotenv').config

const help = {
    name:"excited",
    group:"fun",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message,interaction,lg}) => {
    message = message || interaction
    const gifArray = require('../../assets/url/gifsURL.json').excited
    const embed = bot.wheatSampleEmbedGenerate()
    embed.setTitle(`${message.member.displayName} ${lg.fun.excited}`)
    embed.setImage(bot.wheatRandomElementFromArray(gifArray))
    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help