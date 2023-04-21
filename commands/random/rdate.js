const bot = require('wheat-better-cmd')
const {Message, SlashCommandBuilder, ChatInputCommandInteraction} = require('discord.js');
const moment = require('moment')

const help = {
    name:"rdate",
    group:"random",
    aliases: ["randomdate","ngaunhienngay","datebetween"],
    data: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName('default')
                .setDescription('random from 01/01/1970 to today')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('1option')
                .setDescription('random from 01/01/1970 to last date]')
                .addStringOption(option =>
                    option.setName('lastdate')
                        .setDescription('<DD/MM/YYYY>, date after 01/01/1970')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('2options')
                .setDescription('random from first date to last date')
                .addStringOption(option =>
                    option.setName('firstdate')
                        .setDescription('<DD/MM/YYYY>, date after 01/01/1970')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('lastdate')
                        .setDescription('<DD/MM/YYYY>, date after firstdate')
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
            last = Date.now()/1000
        } else if(args.length===2) {
            first = moment('01/01/1970','DD/MM/YYYY',true).unix()
            last = moment(args[1],'DD/MM/YYYY',true).unix()
        }else if(args.length===3) {
            first = moment(args[1],'DD/MM/YYYY',true).unix()
            last = moment(args[2],'DD/MM/YYYY',true).unix()
        } else {
            await bot.wheatSendErrorMessage(message,lg.error.formatError)
            return
        }
    } else {
        if(interaction.options.getSubcommand()==='default') {
            first=0
            last=Date.now()/1000
        }

        if(interaction.options.getSubcommand()==='1option') {
            first = moment('01/01/1970','DD/MM/YYYY',true).unix()
            last = moment(interaction.options.getString('lastdate'),'DD/MM/YYYY',true).unix()
        }

        if(interaction.options.getSubcommand()==='2options') {
            first = moment(interaction.options.getString('firstdate'),'DD/MM/YYYY',true).unix()
            last = moment(interaction.options.getString('lastdate'),'DD/MM/YYYY',true).unix()
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
    await bot.wheatSend(message,`${lg.random.randomDate}: ${moment.unix(choose).format("DD/MM/YYYY")}`)
}

module.exports.run = run

module.exports.help = help