const { Message, DiscordAPIError } = require('discord.js')
const bot = require('wheat-better-cmd')
require('dotenv').config

const help = {
    name:"kick",
    group:"fun",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {Discord.Client} obj.wheat
 * @param {String[]} obj.args
 */

const run = async ({wheat,message,args,lg}) => {
    const mentionUsers= await bot.wheatGetUserByIdOrMention(wheat,args[1],'0')
    //console.log(mentionUsers)
    if(!mentionUsers) {
        await bot.wheatSendErrorMessage(message,lg.error.needToTriggerAtOnePerson)
        return
    }
    const gifArray = require('../../assets/url/gifsURL.json').kick
    const embed = await bot.wheatSampleEmbedGenerate()
    embed.setTitle(`${message.member.displayName} ${lg.fun.kick} ${mentionUsers.username}`)
    embed.setImage(bot.wheatRandomElementFromArray(gifArray))
    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help