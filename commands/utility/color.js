const {Client, Message, MessageAttachment } = require('discord.js')
const bot = require('wheat-better-cmd')
const { createCanvas, loadImage } = require('canvas')

const help = {
    name:"color",
    htu:" + [mã màu (hex, int, RGB)]",
    des:"Xem màu sắc ứng với mã",
    group:"utility",
    aliases: ["mau","sac","clr"]
}

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

const run = async ({message, args}) => {
    const code = args[1]
    let deccode=bot.wheatRandomNumberBetween(0,16777215)
    if(code) {
        if(code.includes(',')) {
            const rgb = code.split(',')
            const red=Number(rgb[0]),green=Number(rgb[1]),blue=Number(rgb[2])
            if(!red||!green||!blue) {
                await bot.wheatSendErrorMessage(message,`Mã màu nhập không hợp lệ!`)
                return
            }
            if(0>red||red>255||0>green||green>255||0>blue||blue>255) {
                await bot.wheatSendErrorMessage(message,`Mã màu nhập không hợp lệ!`)
                return
            }
            deccode=red*65536+green*256+blue
        } else {
            if(code[0]==='#'||code.startsWith('0x')) {
                if(code[0]==='#'&&code.length!=7) {
                    await bot.wheatSendErrorMessage(message,`Mã màu nhập không hợp lệ!`)
                    return
                }
                const int = parseInt(code[0]==='#'?'0x'+code.substr(1,6):code,16)
                if(!int) {
                    await bot.wheatSendErrorMessage(message,`Mã màu nhập không hợp lệ!`)
                    return
                }
                deccode=int
            } else {
                const int = Number(code)
                if(!int) {
                    await bot.wheatSendErrorMessage(message,`Mã màu nhập không hợp lệ!`)
                    return
                }
                if(int<0||int>16777215) {
                    await bot.wheatSendErrorMessage(message,`Mã màu nhập không hợp lệ!`)
                    return
                }
                deccode=int
            }
        }
    }
    const red=(deccode&0xff0000)>>16
    const green= (deccode&0x00ff00)>>8
    const blue= (deccode&0x0000ff)

    let hexa=deccode.toString(16)
    while(hexa.length!='6') hexa="0"+hexa
    const canvas = createCanvas(200, 200)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = `#${hexa}`
    ctx.fillRect(0, 0, 200, 200)
    const embed = await bot.wheatSampleEmbedGenerate() 
    const attachment = new MessageAttachment(canvas.toBuffer(),`${hexa}.png`)
    embed.setTitle(`🎨 Mã màu: #${hexa}`)
    embed.setDescription(`HEXA: **#${hexa}**\nDEC: **${deccode}**\nRGB: **(${red},${green},${blue})**`)
    embed.setThumbnail(`attachment://${hexa}.png`)
    await bot.wheatEmbedAttachFilesSend(message,[embed],[attachment])
}

module.exports.run = run

module.exports.help = help