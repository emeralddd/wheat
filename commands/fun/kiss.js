const { Message, DiscordAPIError } = require('discord.js')
const bot = require('wheat-better-cmd')
require('dotenv').config

const help = {
    name:"kiss",
    htu:"+ <mention/id>",
    des:"Gif thể hiện cảm xúc & hành động",
    group:"fun",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {Discord.Client} obj.wheat
 * @param {String[]} obj.args
 */

const run = async ({wheat,message,args}) => {
    const mentionUsers= await bot.wheatGetUserByIdOrMention(wheat,args[1],'0')
    //console.log(mentionUsers)
    if(!mentionUsers) {
        await bot.wheatSendErrorMessage(message,'Cần bổ sung một người để thực hiện hành động!')
        return
    }
    const gifArray = require('../../storage/gifsurl.json').kiss
    const embed = await bot.wheatSampleEmbedGenerate()
    embed.setTitle(`${message.member.displayName} hônnn ${mentionUsers.username}`)
    embed.setImage(bot.wheatRandomElementFromArray(gifArray))
    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help