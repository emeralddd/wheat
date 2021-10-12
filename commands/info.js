const moment = require('moment')
const bot = require('wheat-better-cmd')

const help = {
    name:"info",
    htu:"",
    des:"Xem thông tin của Bot!",
    group:"utility",
    aliases: ["thongtin"]
}

const run = async ({wheat,message}) => {
    const embed = await bot.wheatSampleEmbedGenerate(true)
    embed.setAuthor(`Wheat#1261`,process.env.AVATAR)
    embed.setTitle(`About me`)
    embed.setDescription(`Bot xem bài Tarot, 12 cung Hoàng Đạo, Tử Vi, ... bằng tiếng Việt tốt nhất trên Discord!`)
    const uptime_milli = moment.duration(wheat.uptime,'milliseconds')
    const overview = require('../logs/overview.json').logs  
    let count=14

    embed.addFields(
        {
            name: "Version",
            value: overview[overview.length-1],
            inline: true
        },
        {
            name: "Uptime",
            value: `${Math.floor(uptime_milli.asHours())} giờ, ${Math.floor(uptime_milli.asMinutes())%60} phút, ${Math.floor(uptime_milli.asSeconds())%60} giây`,
            inline: true
        },
        {
            name: "Developer",
            value: `VC | emerald  💎#9999`,
            inline: true
        },
        {
            name: "Server",
            value: String(wheat.guilds.cache.size),
            inline: true
        },
        {
            name: "Shard",
            value: "1",
            inline: true
        },
        {
            name: "Commands",
            value: String(count),
            inline: true
        }
    )
    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help