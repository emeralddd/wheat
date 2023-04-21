const bot = require('wheat-better-cmd')
const {AttachmentBuilder, Message, ChatInputCommandInteraction, SlashCommandBuilder} = require('discord.js');
const moment = require('moment')

const help = {
    name:"rtime",
    group:"random",
    aliases: ["randomtime","ngaunhiengio","timebetween"],
    data: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName('default')
                .setDescription('random from 00:00 to 23:59')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('1option')
                .setDescription('random from 00:00 to time chosen')
                .addStringOption(option =>
                    option.setName('time')
                        .setDescription('<hh:mm>, from 00:00 to 23:59')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('2options')
                .setDescription('random from first time to last time')
                .addStringOption(option =>
                    option.setName('firsttime')
                        .setDescription('<hh:mm>, from 00:00 to 23:59')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('lasttime')
                        .setDescription('<hh:mm>, from 00:00 to 23:59')
                        .setRequired(true)
                )
        )
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 * @param {String[]} obj.args
 */

const run = async ({message,interaction,args,lg}) => {
    let first,last

    if(message) {
        if(args.length===1) {
            first = 0
            last = Date.now()
        } else if(args.length===2) {
            first = moment(`00:00 05/01/1970`,'HH:mm DD/MM/YYYY',true).unix()
            last = moment(`${args[1]} 05/01/1970`,'HH:mm DD/MM/YYYY',true).unix()
        } else if(args.length===3) {
            first = moment(`${args[1]} 05/01/1970`,'HH:mm DD/MM/YYYY',true).unix()
            last = moment(`${args[2]} 05/01/1970`,'HH:mm DD/MM/YYYY',true).unix()
        } else {
            await bot.wheatSendErrorMessage(message,lg.error.formatError)
            return
        }
    } else {
        if(interaction.options.getSubcommand()==='default') {
            first=0
            last=Date.now()
        }

        if(interaction.options.getSubcommand()==='1option') {
            first = moment(`00:00 05/01/1970`,'HH:mm DD/MM/YYYY',true).unix()
            last = moment(`${interaction.options.getString('lastdate')} 05/01/1970`,'HH:mm DD/MM/YYYY',true).unix()
        }

        if(interaction.options.getSubcommand()==='2options') {
            first = moment(`${interaction.options.getString('firstdate')} 05/01/1970`,'HH:mm DD/MM/YYYY',true).unix()
            last = moment(`${interaction.options.getString('lastdate')} 05/01/1970`,'HH:mm DD/MM/YYYY',true).unix()
        }
    }

    message||=interaction

    if((!first&&first!=0)||(!last&&last!=0)) {
        await bot.wheatSendErrorMessage(message,lg.error.formatError)
        return 
    }
    
    if(first>last) {
        await bot.wheatSendErrorMessage(message,lg.error.startMustBeBeforeEnd)
        return
    }

    const choose = bot.wheatRandomNumberBetween(first,last)
    await bot.wheatSend(message,`${lg.random.randomTime}: ${moment.unix(choose).format("hh:mm")}`)
}

module.exports.run = run

module.exports.help = help