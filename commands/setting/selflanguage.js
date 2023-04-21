const bot = require('wheat-better-cmd')
const {Message, ChatInputCommandInteraction, SlashCommandBuilder} = require('discord.js');
const databaseManager = require('../../modules/databaseManager')
require('dotenv').config({path: 'secret.env'})

const help = {
    name:"selflanguage",
    group:"setting",
    aliases: ["selflang","ngonngurieng","nnr","sl"],
    rate:2000,
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('language')
                .setDescription('choose self language')
                .addChoices(
                    { name: 'Tiếng Việt', value: 'vi_VN' },
                    { name: 'English', value: 'en_US' },
                )
        )
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 * @param {String[]} obj.args
 * @param {String[]} obj.langList
 */

const run = async ({message,interaction,args,langList,lg,language,lang}) => {
    message||=interaction
    const embed = bot.wheatSampleEmbedGenerate()
    const memberId = message.member.id
    const find = databaseManager.getMember(memberId)

    if(interaction) {
        args=['']
        if(interaction.options.getString('language')) {
            args.push(interaction.options.getString('language'))
        }
    }
    
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