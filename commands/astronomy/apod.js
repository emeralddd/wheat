const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')
const axios = require('axios').default
require('dotenv').config()
const moment = require('moment')

const help = {
    // status:"dev",
    name:"apod",
    group:"astronomy",
    aliases: ['astropic','nasapic','picday']
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message,args,lg}) => {
    const date = args[1] || moment().subtract(1, 'days').format('DD/MM/YYYY')
    
    const mmt = moment(date,'DD/MM/YYYY',true)
    if(!mmt.isValid()) {
        await bot.wheatSendErrorMessage(message,lg.error.formatError)
        return
    }

    if(mmt.isBefore('1995-06-16')) {
        await bot.wheatSendErrorMessage(message,lg.error.dateAfterApod)
        return
    }

    if(mmt.isAfter(moment().subtract(1,'days'))) {
        await bot.wheatSendErrorMessage(message,lg.error.dateOverApod)
        return
    }
    
    const date_str= mmt.format('YYYY-MM-DD')

    const key = [process.env.NASA_KEY1,process.env.NASA_KEY2,process.env.NASA_KEY3]

    const res = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${bot.wheatRandomElementFromArray(key)}&date=${date_str}`)

    if(!res.data.title) {
        await bot.wheatSendErrorMessage(message,lg.error.undefinedError)
        return
    }

    const embed = await bot.wheatSampleEmbedGenerate()

    embed.setTitle(res.data.title)
    embed.setFooter({text:`${lg.main.copyright}: ${res.data.copyright || "NASA"}`})
    embed.setTimestamp(mmt.toDate())
    embed.setImage(res.data.url)
    embed.setDescription(res.data.explanation)

    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help