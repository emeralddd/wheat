const bot = require('wheat-better-cmd')
const {Client, Message} = require('discord.js')
const moment = require('moment')

const help = {
    name:"remoji",
    group:"random",
    aliases: ["re","emoji","randomemoji"]
}

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Message} obj.message
 */

const run = async ({wheat,message,interaction,lg}) => {
    message||=interaction
    const embed = bot.wheatSampleEmbedGenerate()
    const emoji = wheat.emojis.cache.random()

    embed.setTitle(`Random Emoji`)
    embed.setDescription(`<${emoji.animated?``:`:`}${emoji.identifier}>\n${lg.main.name}: ${emoji.name}\nID: ${emoji.id}\nServer: ${emoji.guild.name}\nAnimated: ${emoji.animated?lg.main.yes:lg.main.no}\nCode: `+"`"+emoji.identifier+"`"+(emoji.author?`${lg.main.addedBy}: ${emoji.author.username}`:``))
    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help