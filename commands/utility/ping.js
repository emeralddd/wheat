const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')

const help = {
    name:"ping",
    htu:"",
    des:"Xem thời gian phản hồi Ping của bot",
    group:"utility",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    embed.setDescription(`**Pong! in ` + String(new Date().getTime() - message.createdTimestamp ) + ` ms!**`)
    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help