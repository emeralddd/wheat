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
 */

const run = async ({message,lg}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    embed.setDescription(`**Pong! ${lg.main.in} ` + String(new Date().getTime() - message.createdTimestamp ) + ` ${lg.main.miliseconds}!**`)
    await bot.wheatEmbedSend(message,[embed])
}

/**
 * @param {object} obj
 * @param {ChatInputCommandInteraction} obj.interaction
 */

const runinteraction = async({interaction,lg}) => {
    await interaction.reply(`**Pong! ${lg.main.in} ` + String(new Date().getTime() - interaction.createdTimestamp ) + ` ${lg.main.miliseconds}!**`)
}

module.exports.run = run

module.exports.runinteraction = runinteraction

module.exports.help = help