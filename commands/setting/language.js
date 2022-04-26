const bot = require('wheat-better-cmd')
const {Message,Permissions} = require('discord.js')
const servers = require('../../models/server')
require('dotenv').config()

const help = {
    name:"language",
    group:"setting",
    aliases: ["lang","ngonngu"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String[]} obj.args
 * @param {String[]} obj.langList
 */

const run = async ({message,args,langList,lg,language,lang}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    const perm = message.member.permissions
    if(!(perm.has(Permissions.FLAGS.ADMINISTRATOR)||perm.has(Permissions.FLAGS.MANAGE_GUILD)))  {
        await bot.wheatSendErrorMessage(message,lg.error.missingPermission)
        return
    }
    
    const guildid=message.guild.id
    
    if(!args[1]) {
        try {
            const find = await servers.findOne({id: guildid})
            if((!find) || (find && !find.language)) {
                embed.setDescription(`${lg.main.languageAtThisServer}: **${process.env.CODE}**`)            
            } else {
                embed.setDescription(`${lg.main.languageAtThisServer}: **${find.language}**`)
            }

            await bot.wheatEmbedSend(message,[embed])
        } catch(err) {
            console.log(error)
            await bot.wheatSendErrorMessage(message,lg.error.undefinedError)
        }
        return
    }

    if(!langList.includes(args[1])) {
        await bot.wheatSendErrorMessage(message,`${lg.error.wrongLanguage} **${langList.join(', ')}**`)
        return
    }

    try {
        const find = await servers.findOneAndUpdate(
            {id:guildid},
            {language:args[1]},
            {new:true}
        )
        
        if(!find) {
            const newLang = new servers({id:guildid,language:args[1]})
            await newLang.save()
        }
        
        // console.log(language['en_US'])

        embed.setTitle(language[args[1]].main.successExecution)
        embed.setDescription(`${language[args[1]].main.changeLanguageTo} **`+args[1]+`**`)
        await bot.wheatEmbedSend(message,[embed])
    } catch(error) {
        console.log(error)
        await bot.wheatSendErrorMessage(message,lg.error.undefinedError)
    }
}

module.exports.run = run

module.exports.help = help