const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')
const axios = require('axios').default
require('dotenv').config()
const moment = require('moment')

const help = {
    status:"dev",
    name:"apod",
    htu:" + [ngày ở định dạng DD/MM/YYYY]",
    des:"Xem một bức ảnh thiên văn theo ngày của NASA",
    group:"astronomy",
    aliases: ['astropic','nasapic','picday']
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message,args}) => {
    const date = args[1]
    const mmt =moment(date,'DD/MM/YYYY',true)
    if(!mmt.isValid()) {
        await bot.wheatSendErrorMessage(message,`Sai cấu trúc ngày!`)
        return
    }
    
    const date_str= mmt.format('YYYY-MM-DD')

    const res = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_KEY}&date=${date_str}`)

    const embed = await bot.wheatSampleEmbedGenerate()

    embed.setTitle(res.data.title)
    embed.setFooter(`Copyright: ${res.data.copyright}`)
    embed.setTimestamp(mmt.toDate())
    embed.setImage(res.data.hdurl)
    embed.setDescription(res.data.explanation)

    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help