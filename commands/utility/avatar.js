const {Client, Message } = require('discord.js')
const bot = require('wheat-better-cmd')


const help = {
    name:"avatar",
    group:"utility",
    aliases: ["ava","daidien"]
}

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

const run = async ({wheat, message, args, lg}) => {
    const embed = await bot.wheatSampleEmbedGenerate()

    try {
        const USER = await bot.wheatGetUserByIdOrMention(wheat,args[1],message.author.id)
        if(!USER) {
            await bot.wheatSend(message, lg.error.notFoundThatUser)
            return
        }
        
        embed.setAuthor(`${USER.username}#${USER.discriminator}`,USER.avatarURL())
        embed.setImage(`${USER.avatarURL()}?size=1024`)
        await bot.wheatEmbedSend(message,[embed])
    } catch (error) {
        await bot.wheatSend(message, lg.error.notFoundThatUser)
        return
    }
}

module.exports.run = run

module.exports.help = help