const bot = require('wheat-better-cmd')
const {Message,Permissions} = require('discord.js')
const servers = require('../../models/server')

const help = {
    name:"prefix",
    htu:" <prefix mới>",
    des:"Đổi prefix của bot",
    group:"setting",
    aliases: ["pf"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

const run = async ({message,args}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    const perm = message.member.permissions
    if(!(perm.has(Permissions.FLAGS.ADMINISTRATOR)||perm.has(Permissions.FLAGS.MANAGE_GUILD)))  {
        await bot.wheatSendErrorMessage(message,`Bạn cần phải có 1 trong 2 quyền **Administrator** hoặc **Manager Server** để thực thi lệnh này!`)
        return
    }
    if(!args[1]) {
        await bot.wheatSendErrorMessage(message,`Thiếu prefix mới!`)
        return
    }
    if(args[1].length>32) {
        await bot.wheatSendErrorMessage(message,`Prefix phải có độ dài nhỏ hơn hoặc bằng 32 kí tự`)
        return
    }

    const guildid=message.guild.id

    try {
        const find = await servers.findOneAndUpdate(
            {id:guildid},
            {prefix:args[1]},
            {new:true}
        )
        
        if(!find) {
            const newPrefix = new servers({id:guildid,prefix:args[1]})
            await newPrefix.save()
        }
        
        embed.setTitle(`Đổi Prefix thành công!`)
        embed.setDescription(`Đã đổi thành công prefix của server thành **`+args[1]+`**`)
        await bot.wheatEmbedSend(message,[embed])
    } catch(error) {
        console.log(error)
        await bot.wheatSendErrorMessage(message,`Đã có lỗi trong quá trình thực thi, vui lòng thử lại sau ít phút!`)
    }
}

module.exports.run = run

module.exports.help = help