const bot = require('wheat-better-cmd')
const qrcode = require('qrcode')
const { MessageAttachment, Message } = require('discord.js')

const help = {
    name:"qrgen",
    group:"utility",
    aliases: ["taoqr","qrgenerator","qr"]
}

/**
 * @param {object} obj
 * @param {String[]} obj.S
 * @param {Message} obj.message
 */

const run = async ({S, message,lg}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    
    let content=""
    let block=true
    for(let i=1; i<S.length; i++) {
        if(!(S[i]===''&&block)) {
            block=false
            content+=S[i]+(i===S.length-1?"":" ")
        }
    }
    
    if(content.length===0) {
        await bot.wheatSendErrorMessage(message,lg.error.missingData)
        return
    }

    if(content.length>1600) {
        await bot.wheatSendErrorMessage(message,lg.error.wrongQrLength)
        return
    }

    qrcode.toBuffer(content,async (err,buffer) => {
        if(err) {
            await bot.wheatSendErrorMessage(message,lg.error.undefinedError)
            return
        }
        const attachment = new MessageAttachment(buffer,'qr.png')
        embed.setImage('attachment://qr.png')
        embed.setTitle(lg.main.successExecution)
        embed.setDescription(content)
        await bot.wheatEmbedAttachFilesSend(message,[embed],[attachment])
    })
}

module.exports.run = run

module.exports.help = help