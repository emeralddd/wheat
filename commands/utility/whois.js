const bot = require('wheat-better-cmd')
const moment = require('moment')
const { Message, Client } = require('discord.js')

const help = {
    name:"whois",
    htu:" + [mention/id]",
    des:"Xem thông tin của ai đó!",
    group:"utility",
    aliases: ["timnguoi","findinfo","aila"]
}

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

const run = async ({wheat, message, args}) => {
    const embed = await bot.wheatSampleEmbedGenerate()

    try {
        const USER = await bot.wheatGetUserByIdOrMention(wheat,args[1],message.author.id)
        if(!USER) {
            await bot.wheatSend(message, `Không tìm thấy người dùng đó!`)
            return
        }

        const MEMBER = await message.guild.members.fetch(USER.id)
        embed.setThumbnail(`${USER.avatarURL()}?size=1024`)
        embed.setAuthor(`${USER.username}#${USER.discriminator}`)
        embed.setTitle(`Who is ${USER.username}?`)
        embed.setColor(MEMBER.displayHexColor)
        //embed.setDescription(MEMBER.presence.activities.forEach(act => act.name))
        let roleList = ""
        MEMBER.roles.cache.each(role => roleList+=`<@&${role.id}> `)
        embed.addFields(
            {
                name:"Tên hiển thị",
                value: `${MEMBER.displayName} (<@${MEMBER.id}>)`
            },
            {
                name:"Tham gia Server",
                value: moment(MEMBER.joinedAt).format('HH:mm:ss DD/MM/YYYY')
            },
            {
                name:"Lập tài khoản",
                value: moment(USER.createdAt).format('HH:mm:ss DD/MM/YYYY')
            },
            {
                name:"Role",
                value: String(roleList)
            },
            {
                name:"Permission",
                value: String(MEMBER.permissions.toArray())
            }
        )

        await bot.wheatEmbedSend(message,[embed])
    } catch (error) {
        console.log(error)
        await bot.wheatSend(message, `Không tìm thấy người dùng đó!`)
        return
    }
}

module.exports.run = run

module.exports.help = help