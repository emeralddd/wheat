const bot = require('wheat-better-cmd')
const {Message,PermissionsBitField, Collection, ChatInputCommandInteraction, SlashCommandBuilder} = require('discord.js')
const databaseManager = require('../../modules/databaseManager')

const help = {
    name:"disable",
    group:"setting",
    aliases: ["ignore","photlo","lamlo"],
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('options')
                .setDescription('[all/command 1/group command 1] [all/command 2/group command 2] ...')
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator | PermissionsBitField.Flags.ManageGuild)
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 * @param {String[]} obj.args
 * @param {String[]} obj.langList
 * @param {Collection} obj.aliasesList
 * @param {Array} obj.groupMenu
 * @param {Collection} obj.commandsList
 * @param {Array} obj.groups
 */

const run = async ({message,interaction,args,lg,groupMenu,aliasesList,commandsList,groups}) => {
    const embed = bot.wheatSampleEmbedGenerate()

    if(message) {
        const perm = message.member.permissions
        if(!(perm.has(PermissionsBitField.Flags.Administrator)||perm.has(PermissionsBitField.Flags.ManageGuild)))  {
            await bot.wheatSendErrorMessage(message,lg.error.missingPermission)
            return
        }
    } else {
        args = ['disable']
        if(interaction.options.getString('options')) args = [...args,...interaction.options.getString('options').split(' ')]
    }

    // console.log(args)

    let disabledCommands=[]
    
    for(let i=1; i<args.length; i++) {
        if(args[i]==='enable' || aliasesList.get(args[i])==='enable') continue
        
        if(args[i]==='all') {
            for(const g of groups) {
                for(const command of groupMenu[g]) {
                    if(command!=='enable') disabledCommands.push(command)
                }
            }
        } else if(commandsList.has(args[i])) {    
            disabledCommands.push(args[i])
        } else if(aliasesList.has(args[i])) {
            disabledCommands.push(aliasesList.get(args[i]))
        } else if(groups.includes(args[i])) {
            for(const command of groupMenu[args[i]]) {
                if(command!=='enable') disabledCommands.push(command)
            }
        }
    }
    
    disabledCommands = Array.from(new Set(disabledCommands))

    message||=interaction
    
    const guildId = message.guild.id
    const channelId = message.channel.id

    try {
        let disableList = new Map()

        const find = databaseManager.getServer(guildId)
        if(find && find.disable) disableList = find.disable

        if(disabledCommands.length>0) {
            for(const command of disabledCommands) {
                if(disableList.has(command)) {
                    if(!disableList.get(command).includes(channelId)) 
                        disableList.get(command).push(channelId)
                } else {
                    disableList.set(command,[channelId])
                }
            }

            if(find) {
                databaseManager.updateServer(guildId,{
                    disable: disableList
                })
            } else {
                databaseManager.newServer(guildId,{
                    disable: disableList
                })
            }
        }

        embed.setTitle(lg.main.successExecution)
        
        for(const group of groups) {
            let commands = []
            for(const command of groupMenu[group]) {
                if(disableList.has(command) && disableList.get(command).includes(channelId)) {
                    commands.push("~~`"+command+"`~~")
                } else {
                    commands.push("**`"+command+"`**")
                }
            }

            embed.addFields({
                name:group,
                value: commands.join(" ")
            })
        }

        await bot.wheatEmbedSend(message,[embed])
    } catch(error) {
        console.log(error)
        await bot.wheatSendErrorMessage(message,lg.error.undefinedError)
    }
}

module.exports.run = run

module.exports.help = help