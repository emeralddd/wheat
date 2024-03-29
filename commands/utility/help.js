const { Message, Collection, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd')

const help = {
    name:"help",
    group:"utility",
    aliases: [],
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('option')
            .setDescription('command/group command')
        )
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 * @param {String[]} obj.args
 * @param {Array} obj.helpMenu
 * @param {Array} obj.groupMenu
 * @param {string} obj.prefix
 * @param {Collection} obj.aliasesList
 */

const run = async ({message,interaction,args,helpMenu,groupMenu,prefix,aliasesList,language,lang}) => {

    const lg=language[lang]

    const embed = bot.wheatSampleEmbedGenerate(true)
    embed.setAuthor({name:`Wheat#1261`,iconUrl:process.env.AVATAR})

    message||=interaction

    if((args&&args.length===1)||(interaction&&(!interaction.options.getString('option')))) {
        embed.setTitle(lg.help.listCommand) 
        embed.setDescription(lg.help.note2+'`'+prefix+lg.help.note3+'\n**'+lg.help.note4+'https://discord.gg/z5Z4uzmED9**')
        embed.addFields(
            { 
                name: language[lang].help.astronomy, 
                value: '`'+groupMenu['astronomy'].join('` `')+'`'
            },
            { 
                name: language[lang].help.fortuneTelling, 
                value: '`'+groupMenu['ftelling'].join('` `')+'`'
            },
            {
                name: language[lang].help.random, 
                value: '`'+groupMenu['random'].join('` `')+'`'
            },
            { 
                name: language[lang].help.fun, 
                value: '`'+groupMenu['fun'].join('` `')+'`'
            },
            { 
                name: language[lang].help.utility, 
                value: '`'+groupMenu['utility'].join('` `')+'`'
            },
            { 
                name: language[lang].help.setting, 
                value: '`'+groupMenu['setting'].join('` `')+'`'
            }
        )
        await bot.wheatEmbedSend(message,[embed])
        return
    }

    let list="",command
    command = (args?args[1]:interaction.options.getString('option').trim()).toLowerCase()

    if(groupMenu[command]) {
        if(command === 'admin') return
        for(const id of groupMenu[command]) {
            list+=" `" + id + "`"
        }
        embed.setTitle(`${lg.help.groupCommand}: ${command}`)
        embed.setDescription(list)

        await bot.wheatEmbedSend(message,[embed])
        return
    }

    if(aliasesList.has(command)) command = aliasesList.get(command)
    if(helpMenu[command]) {
        for(const id of helpMenu[command].aliases) {
            list+= " `" + id + "`"
        }
        
        if(list==="") list = lg.help.none
        if(helpMenu[command].group==='') return

        embed.setTitle(`${lg.help.command}: ${command}`)
        embed.addFields(
            {
                name: lg.help.parentGroup,
                value: "`"+helpMenu[command].group+"`",
            },
            {
                name: lg.help.aliases,
                value: list,
            },
            {
                name: lg.help.syntax,
                value: "`" + prefix +command+helpMenu[command].syntax[lang] + "`\n"+helpMenu[command].note[lang], 
            },
            {
                name: lg.help.ratelimit,
                value: `${helpMenu[command].rate?helpMenu[command].rate/1000:0}s`,
            }
        )

        if(helpMenu[command].desc[lang]==="") {
            console.log(command)
            return
        }

        if(helpMenu[command].desc[lang][0]===' ') console.log(command)
        
        embed.setDescription(helpMenu[command].desc[lang])
        embed.setFooter({text:lg.help.note1})
            
        await bot.wheatEmbedSend(message,[embed])
    } else {
        await bot.wheatSend(message,lg.help.noCommand)
    }
}

module.exports.run = run

module.exports.help = help