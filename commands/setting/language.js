const bot = require('wheat-better-cmd')
const {Message,PermissionsBitField, SlashCommandBuilder, ChatInputCommandInteraction} = require('discord.js')
const databaseManager = require('../../modules/databaseManager')
require('dotenv').config({path: 'secret.env'})

const help = {
    name:"language",
    group:"setting",
    aliases: ["lang","ngonngu"],
    rate:3000,
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('language')
                .setDescription('choose language')
                .addChoices(
                    { name: 'Tiếng Việt', value: 'vi_VN' },
                    { name: 'English', value: 'en_US' },
                )
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator | PermissionsBitField.Flags.ManageGuild)
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 * @param {String[]} obj.args
 * @param {String[]} obj.langList
 */

const run = async ({message,interaction,args,langList,lg,language,lang}) => {
    const embed = bot.wheatSampleEmbedGenerate()

    if(message) {
        const perm = message.member.permissions
        if(!(perm.has(PermissionsBitField.Flags.Administrator)||perm.has(PermissionsBitField.Flags.ManageGuild)))  {
            await bot.wheatSendErrorMessage(message,lg.error.missingPermission)
            return
        }
    } else {
        args=['']
        if(interaction.options.getString('language')) args.push(interaction.options.getString('language'))
    }

    message||=interaction
    
    const guildid=message.guild.id
    
    const find = await databaseManager.getServer(guildid)
    
    if(!args[1]) {
        try {
            
            if((!find) || (find && !find.language)) {
                embed.setDescription(`${lg.main.languageAtThisServer}: **${process.env.CODE}**`)            
            } else {
                embed.setDescription(`${lg.main.languageAtThisServer}: **${find.language}**`)
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
            await databaseManager.updateServer(guildid,{
                language:args[1]
            })
        } else {
            await databaseManager.newServer(guildid,{
                language:args[1]
            })
        }
 
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