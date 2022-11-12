const bot = require('wheat-better-cmd')
const { Message, PermissionsBitField, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js')
const databaseManager = require('../../modules/databaseManager')

const help = {
    name:"prefix",
    group:"setting",
    aliases: ["pf"],
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('prefix')
                .setDescription('length < 33')
                .setMaxLength(32)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator | PermissionsBitField.Flags.ManageGuild)
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 * @param {String[]} obj.args
 */

const run = async ({message,interaction,args,lg}) => {
    const embed = bot.wheatSampleEmbedGenerate()
    if(message) {
        const perm = message.member.permissions
        if(!(perm.has(PermissionsBitField.Flags.Administrator)||perm.has(PermissionsBitField.Flags.ManageGuild)))  {
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
    } else {
        args=['']
        if(interaction.options.getString('prefix')) args.push(interaction.options.getString('prefix'))
    }

    message||=interaction

    const guildid=message.guild.id

    try {
        const find = databaseManager.getServer(guildid)

        if(find) {
            await databaseManager.updateServer(guildid,{
                prefix:args[1]
            })
        } else {
            await databaseManager.newServer(guildid,{
                prefix:args[1]
            })
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