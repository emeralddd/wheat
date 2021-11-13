const { Client, Message } = require('discord.js')
const moment = require('moment')
const bot = require('wheat-better-cmd')

const help = {
    name:"info",
    htu:"",
    des:"Xem thông tin của Bot!",
    group:"utility",
    aliases: ["thongtin"]
}

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Message} obj.message
 * @param {Array} obj.helpMenu
 */

const run = async ({wheat,message,helpMenu}) => {
    const embed = await bot.wheatSampleEmbedGenerate(true)
    embed.setAuthor(`Wheat#1261`,process.env.AVATAR)
    embed.setTitle(`About me`)
    embed.setDescription(`Bot xem bài Tarot, 12 cung Hoàng Đạo, Tử Vi, ... bằng tiếng Việt tốt nhất trên Discord!`)
    const uptime_milli = moment.duration(wheat.uptime,'milliseconds')
    const overview = require('../../logs/overview.json').logs  
    //console.log(helpMenu)
    const promises = [
        await wheat.shard.fetchClientValues('guilds.cache.size'),
    ]

    const guildCount = await Promise.all(promises)
        .then(results => {
				return results[0].reduce((acc, guildCount) => acc + guildCount, 0)
			})
		.catch(console.error)

    const count=20

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
            value: String(guildCount),
            inline: true
        },
        {
            name: "Shard",
            value: "2",
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