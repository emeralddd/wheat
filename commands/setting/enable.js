const bot = require('wheat-better-cmd')
const {Message,Permissions, Collection} = require('discord.js')
const servers = require('../../models/server')

const help = {
    name:"enable",
    group:"setting",
    aliases: ["hear","listen","bophotlo"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String[]} obj.args
 * @param {String[]} obj.langList
 * @param {Collection} obj.aliasesList
 * @param {Array} obj.groupMenu
 * @param {Collection} obj.commandsList
 * @param {Array} obj.groups
 */

const run = async ({message,args,lg,groupMenu,aliasesList,commandsList,groups}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    const perm = message.member.permissions
    if(!(perm.has(Permissions.FLAGS.ADMINISTRATOR)||perm.has(Permissions.FLAGS.MANAGE_GUILD)))  {
        await bot.wheatSendErrorMessage(message,lg.error.missingPermission)
        return
    }

    const guildId = message.guild.id
    const channelId = message.channel.id

    let enabledCommands=[]

    for(let i=1; i<args.length; i++) {
        if(args[i]==='all') {
            for(const g of groups) {
                for(const command of groupMenu[g]) {
                    enabledCommands.push(command)
                }
            }
        } else if(commandsList.has(args[i])) {
            enabledCommands.push(args[i])
        } else if(aliasesList.has(args[i])) {
            enabledCommands.push(aliasesList.get(args[i]))
        } else if(groups.includes(args[i])) {
            for(const command of groupMenu[args[i]]) {
                enabledCommands.push(command)
            }
        }
    }

    enabledCommands = Array.from(new Set(enabledCommands))

    // console.log(enabledCommands)

    try {
        let disableList = new Map()

        const find = await servers.findOne({id:guildId})
        if(find && find.disable) disableList = find.disable

        if(enabledCommands.length>0) {
            for(const command of enabledCommands) {
                if(disableList.has(command)) {
                    const tmp = disableList.get(command).indexOf(channelId)
                    if(tmp!==-1) disableList.get(command).splice(tmp,1)
                }
            }

            if(find) {
                await servers.findOneAndUpdate(
                    {id: guildId},
                    {disable: disableList},
                    {new:true}
                )
            } else {
                const newServer = new servers({
                    id: guildId,
                    disable: disableList
                })

                await newServer.save()
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