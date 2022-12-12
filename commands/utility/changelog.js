const { Message, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js')
const bot = require('wheat-better-cmd')

const help = {
    name:"changelog",
    group:"utility",
    aliases: ["lichsucapnhat","lscn","cl"],
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('update')
                .setDescription('lists/update name')
        )
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 * @param {String[]} obj.args
 */

const run = async ({message,interaction,args,lg}) => {
    const overview = require('../../logs/overview.json').logs  
    const latest = require('../../logs/overview.json').latest
    const embed = bot.wheatSampleEmbedGenerate(true)
    let logChosen = (message?args[1]:interaction.options.getString('update')) || latest
    
    logChosen.trim()
    
    message||=interaction

    if(logChosen === 'lists') {
        embed.setTitle(lg.main.changeLogList)
        
        let details = ""

        for(const value of overview.reverse()) {
            details+="(#) `"+value+"`\n"
        }
        
        embed.setDescription(`${lg.main.latestUpdate}: **${latest}**`)
        embed.addFields([{
            name: `▼`,
            value: details
        }])
        await bot.wheatEmbedSend(message,[embed])
        return
    }

    if(!overview.includes(logChosen)) {
        await bot.wheatSend(message,lg.error.notFoundThatUpdate)
        return 
    }

    const logJSON = require(`../../logs/${logChosen}.json`)

    embed.setTitle(lg.main.changeLog)
    embed.setDescription(`${lg.main.version}: **${logChosen}**\n${lg.main.previousVersion}: ${logJSON.before}\n${lg.main.generation}: ${logJSON.gen}\n${lg.main.releasebuild}: ${logJSON.release}`);

    let add = ``, remove =``
    logJSON.add.forEach(value => {
        add+=`(+) ${value}\n`
    })

    logJSON.remove.forEach(value => {
        remove+=`(-) ${value}\n`
    })

    embed.addFields([
        {
            name:lg.main.add,
            value: (add===``?lg.help.none:add)
        },
        {
            name:lg.main.remove,
            value: (remove===``?lg.help.none:remove)
        }
    ])

    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help