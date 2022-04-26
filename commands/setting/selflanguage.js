const bot = require('wheat-better-cmd')
const {Message} = require('discord.js')
const members = require('../../models/member')
require('dotenv').config()

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
    
    if(!args[1]) {
        try {
            const find = await members.findOne({id: memberId})
            if((!find) || (find && !find.language)) {
                embed.setDescription(`${lg.main.myLanguage}: **${lg.main.unset}**`)            
            } else {
                embed.setDescription(`${lg.main.myLanguage}: **${find.language}**`)
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
        const find = await members.findOneAndUpdate(
            {id:memberId},
            {language:args[1]},
            {new:true}
        )
        
        if(!find) {
            const newLang = new members({
                id:memberId,
                language:args[1]
            })
            await newLang.save()
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