const bot = require('wheat-better-cmd')
const {Message,Permissions} = require('discord.js')
const servers = require('../../models/server')

const help = {
    name:"prefix",
    group:"setting",
    aliases: ["pf"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

const run = async ({message,args,lg}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    const perm = message.member.permissions
    if(!(perm.has(Permissions.FLAGS.ADMINISTRATOR)||perm.has(Permissions.FLAGS.MANAGE_GUILD)))  {
        await bot.wheatSendErrorMessage(message,lg.error.missingPermission)
        return
    }
    if(!args[1]) {
        await bot.wheatSendErrorMessage(message,lg.error.missingNewPrefix)
        return
    }
    if(args[1].length>32) {
        await bot.wheatSendErrorMessage(message,lg.error.wrongPrefix)
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
        
        embed.setTitle(lg.main.successExecution)
        embed.setDescription(`${lg.main.changePrefixTo} **`+args[1]+`**`)
        await bot.wheatEmbedSend(message,[embed])
    } catch(error) {
        console.log(error)
        await bot.wheatSendErrorMessage(message,lg.error.undefinedError)
    }
}

module.exports.run = run

module.exports.help = help