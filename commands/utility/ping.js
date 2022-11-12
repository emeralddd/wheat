const { Message, ChatInputCommandInteraction } = require('discord.js')
const bot = require('wheat-better-cmd')

const help = {
    name:"ping",
    group:"utility",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 */

const run = async ({interaction,message,lg}) => {
    const embed = bot.wheatSampleEmbedGenerate()
    embed.setDescription(`**Pong! ${lg.main.in} ` + String(new Date().getTime() - (message?message.createdTimestamp:interaction.createdTimestamp) ) + ` ${lg.main.miliseconds}!**`)

    await bot.wheatEmbedSend(message?message:interaction,[embed])
}

module.exports.run = run

module.exports.help = help