const bot = require('wheat-better-cmd')
const {Client, Message} = require('discord.js')
const moment = require('moment')

const help = {
    name:"remoji",
    htu:"",
    des:"Đưa ra một emoji ngẫu nhiên bất kỳ từ một server bất kỳ mà bot đang tham gia!",
    group:"random",
    aliases: ["re","emoji","randomemoji"]
}

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Message} obj.message
 */

const run = async ({wheat,message}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    const emoji = wheat.emojis.cache.random()
    //console.log(emoji)
    embed.setTitle(`Random Emoji`)
    embed.setDescription(`<${emoji.animated?``:`:`}${emoji.identifier}>\nTên: ${emoji.name}\nID: ${emoji.id}\nServer: ${emoji.guild.name}\nAnimated: ${emoji.animated?`Có`:`Không`}\nCode: `+"`"+emoji.identifier+"`"+(emoji.author?`Thêm bởi: ${emoji.author.username}`:``))
    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help