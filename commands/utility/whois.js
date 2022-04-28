const bot = require('wheat-better-cmd')
const moment = require('moment')
const { Message, Client } = require('discord.js')

const help = {
    name:"whois",
    group:"utility",
    aliases: ["timnguoi","findinfo","aila"]
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

        const MEMBER = await message.guild.members.fetch(USER.id)
        embed.setThumbnail(`${USER.avatarURL()}?size=1024`)
        embed.setAuthor({name:`${USER.username}#${USER.discriminator}`})
        embed.setTitle(`${lg.main.whoIs} ${USER.username}?`)
        embed.setColor(MEMBER.displayHexColor)
        let roleList = ""
        MEMBER.roles.cache.each(role => roleList+=`<@&${role.id}> `)
        embed.addFields(
            {
                name: lg.main.displayName,
                value: `${MEMBER.displayName} (<@${MEMBER.id}>)`
            },
            {
                name: lg.main.joinedAt,
                value: moment(MEMBER.joinedAt).format('HH:mm:ss DD/MM/YYYY')
            },
            {
                name: lg.main.createdAt,
                value: moment(USER.createdAt).format('HH:mm:ss DD/MM/YYYY')
            },
            {
                name: lg.main.role,
                value: String(roleList)
            },
            {
                name: lg.main.permissions,
                value: String(MEMBER.permissions.toArray())
            }
        )

        await bot.wheatEmbedSend(message,[embed])
    } catch (error) {
        console.log(error)
        await bot.wheatSend(message, lg.error.notFoundThatUser)
        return
    }
}

module.exports.run = run

module.exports.help = help