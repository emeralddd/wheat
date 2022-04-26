const { Client, Message } = require('discord.js')
const moment = require('moment')
const bot = require('wheat-better-cmd')
require('dotenv').config()

const help = {
    name:"info",
    group:"utility",
    aliases: ["thongtin"]
}

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Message} obj.message
 * @param {Array} obj.helpMenu
 */

const run = async ({wheat,message,lg}) => {
    const embed = await bot.wheatSampleEmbedGenerate(true)
    embed.setAuthor(`Wheat#1261`,process.env.AVATAR)
    embed.setTitle(lg.main.aboutMe)
    embed.setDescription(lg.main.botDescription)
    const uptime_milli = moment.duration(wheat.uptime,'milliseconds')
    const promises = [
        await wheat.shard.fetchClientValues('guilds.cache.size'),
    ]

    const guildCount = await Promise.all(promises)
        .then(results => {
				return results[0].reduce((acc, guildCount) => acc + guildCount, 0)
			})
		.catch(console.error)

    const count=48

    embed.addFields(
        {
            name: lg.main.updateN,
            value: require('../../logs/overview.json').latest,
            inline: true
        },
        {
            name: lg.main.uptime,
            value: `${Math.floor(uptime_milli.asHours())} ${lg.main.hourS}, ${Math.floor(uptime_milli.asMinutes())%60} ${lg.main.minuteS}, ${Math.floor(uptime_milli.asSeconds())%60} ${lg.main.secondS}`,
            inline: true
        },
        {
            name: lg.main.developer,
            value: `temeralddd#1385`,
            inline: true
        },
        {
            name: lg.main.servers,
            value: String(guildCount),
            inline: true
        },
        {
            name: lg.main.shards,
            value: process.env.shards,
            inline: true
        },
        {
            name: lg.main.commands,
            value: String(count),
            inline: true
        }
    )
    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help