const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')

const help = {
    name:"changelog",
    group:"utility",
    aliases: ["lichsucapnhat","lscn","cl"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

const run = async ({message,args,lg}) => {
    const overview = require('../../logs/overview.json').logs  
    const latest = require('../../logs/overview.json').latest
    const embed = await bot.wheatSampleEmbedGenerate(true)
    let logChosen
    if(args[1]) {
        if(args[1] === 'lists') {
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
        if(!overview.includes(args[1])) {
            await bot.wheatSend(message,lg.error.notFoundThatUpdate)
            return 
        }
        logChosen=args[1]
    }

    if(!logChosen) logChosen = latest

    const logJSON = require(`../../logs/${logChosen}.json`)

    embed.setTitle(lg.main.changeLog)
    embed.setDescription(`${lg.main.updateN}: **${logChosen}**\n${lg.main.previousUpdate}: ${logJSON.before}`)

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