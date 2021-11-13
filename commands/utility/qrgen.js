const bot = require('wheat-better-cmd')
const qrcode = require('qrcode')
const { MessageAttachment, Message } = require('discord.js')

const help = {
    name:"qrgen",
    htu:" + <xâu cần tạo QR>",
    des:"Tạo ra mã QR từ xâu có sẵn",
    group:"utility",
    aliases: ["taoqr","qrgenerator","qr"]
}

/**
 * @param {object} obj
 * @param {String[]} obj.S
 * @param {Message} obj.message
 */

const run = async ({S, message}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
   // console.log(S)
    
    let content=""
    let block=true
    //console.log(S)
    for(let i=1; i<S.length; i++) {
    //    console.log(S[i])
        if(!(S[i]===''&&block)) {
            block=false
       //     console.log(S[i])
            content+=S[i]+(i===S.length-1?"":" ")
        }
    }

    //console.log(content)
    
    if(content.length===0) {
        await bot.wheatSendErrorMessage(message,`Chưa nhập dữ liệu!`)
        return
    }

    if(content.length>1600) {
        await bot.wheatSendErrorMessage(message,`Độ dài dữ liệu chỉ được nằm trong khoảng (0,1600]!`)
        return
    }

    qrcode.toBuffer(content,async (err,buffer) => {
        if(err) {
            await bot.wheatSendErrorMessage(message,`Đã xảy ra lỗi khi xử lý, vui lòng thử lại sau!`)
            return
        }
        const attachment = new MessageAttachment(buffer,'qr.png')
        embed.setImage('attachment://qr.png')
        embed.setTitle(`Mã QR được tạo thành công!`)
        embed.setDescription(content)
        await bot.wheatEmbedAttachFilesSend(message,[embed],[attachment])
    })
}

module.exports.run = run

module.exports.help = help