const bot = require('wheat-better-cmd')
const {AttachmentBuilder, Message} = require('discord.js')
const moment = require('moment')

const help = {
    name:"rdate",
    group:"random",
    aliases: ["randomdate","ngaunhienngay","datebetween"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

const run = async ({message,args,lg}) => {
    let first,last
    if(args.length===1) {
        first = 0
        last = Date.now()
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