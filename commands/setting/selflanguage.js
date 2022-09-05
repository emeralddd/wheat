const bot = require('wheat-better-cmd')
const {Message} = require('discord.js')
const databaseManager = require('../../modules/databaseManager')
require('dotenv').config({path: 'secret.env'})

const help = {
    name:"selflanguage",
    group:"setting",
    aliases: ["selflang","ngonngurieng","nnr","sl"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String[]} obj.args
 * @param {String[]} obj.langList
 */

const run = async ({message,args,langList,lg,language,lang}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    const memberId = message.member.id
    const find = databaseManager.getMember(memberId)
    
    if(!args[1]) {
        try {
            if((!find) || (find && !find.language)) {
                embed.setDescription(`${lg.main.myLanguage}: **${lg.main.unset}**`)            
            } else {
                embed.setDescription(`${lg.main.myLanguage}: **${find.language}**`)
            }

            await bot.wheatEmbedSend(message,[embed])
        } catch(err) {
            console.log(err)
            await bot.wheatSendErrorMessage(message,lg.error.undefinedError)
        }
        return
    }

    if(!langList.includes(args[1])) {
        await bot.wheatSendErrorMessage(message,`${lg.error.wrongLanguage} **${langList.join(', ')}**`)
        return
    }

    

    try {
        if(find) {
            await databaseManager.updateMember(memberId,{
                language:args[1]
            })
        } else {
            await databaseManager.newMember(memberId,{
                language:args[1]
            })
        }
        
        embed.setTitle(language[args[1]].main.successExecution)
        embed.setDescription(`${language[args[1]].main.changeSelfLanguageTo} **`+args[1]+`**`)
        await bot.wheatEmbedSend(message,[embed])
    } catch(error) {
        console.log(error)
        await bot.wheatSendErrorMessage(message,lg.error.undefinedError)
    }
}

module.exports.run = run

module.exports.help = help