const {Client, Message, AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js')
const bot = require('wheat-better-cmd')
const { createCanvas, loadImage } = require('canvas')

const help = {
    name:"color",
    group:"utility",
    aliases: ["mau","sac","clr"],
    data: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName('random')
                .setDescription('random color')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rgb')
                .setDescription('get color by rgb code')
                .addIntegerOption(option =>
                    option.setName('red')
                    .setDescription('red code')
                    .setRequired(true)
                    .setMinValue(0)   
                    .setMaxValue(255) 
                )
                .addIntegerOption(option =>
                    option.setName('green')
                    .setDescription('green code')
                    .setRequired(true)
                    .setMinValue(0)   
                    .setMaxValue(255) 
                )
                .addIntegerOption(option =>
                    option.setName('blue')
                    .setDescription('blue code')
                    .setRequired(true)
                    .setMinValue(0)   
                    .setMaxValue(255) 
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('hex')
                .setDescription('get color by hex code')
                .addStringOption(option =>
                    option.setName('hex')
                    .setDescription('eg: #ffffff')
                    .setRequired(true)
                    .setMinLength(7)
                    .setMaxLength(7)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('int')
                .setDescription('get color by int')
                .addIntegerOption(option =>
                    option.setName('int')
                    .setDescription('[0,16777215]')
                    .setRequired(true)
                    .setMinValue(0)
                    .setMaxValue(16777215)
                )
        )
}

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 * @param {String[]} obj.args
 */

const run = async ({message,interaction,args,lg}) => {
    let code = message?args[1]:null
    let deccode=bot.wheatRandomNumberBetween(0,16777215)
    
    message||=interaction
    
    if(code||(interaction&&interaction.options.getSubcommand()!=='random')) {
        if((interaction&&interaction.options.getSubcommand()==='rgb')||((!interaction)&&code.includes(','))) {
            let red,green,blue
            if(interaction) {
                red=interaction.options.getInteger('red')
                green=interaction.options.getInteger('green')
                blue=interaction.options.getInteger('blue')
            } else {
                const rgb = code.split(',')
                red=Number(rgb[0])
                green=Number(rgb[1])
                blue=Number(rgb[2])
                if(!red||!green||!blue) {
                    await bot.wheatSendErrorMessage(message,lg.error.wrongColorCode)
                    return
                }
                if(0>red||red>255||0>green||green>255||0>blue||blue>255) {
                    await bot.wheatSendErrorMessage(message,lg.error.wrongColorCode)
                    return
                }
            }
            
            deccode=red*65536+green*256+blue
        } else {
            if(interaction) {
                code=interaction.options.getString('hex')||interaction.options.getInteger('int')
            }

            if((!Number.isInteger(code))&&(code[0]==='#'||code.startsWith('0x'))) {
                if(code[0]==='#'&&code.length!=7) {
                    await bot.wheatSendErrorMessage(message,lg.error.wrongColorCode)
                    return
                }
                const int = parseInt(code[0]==='#'?'0x'+code.substr(1,6):code,16)
                if(!int) {
                    await bot.wheatSendErrorMessage(message,lg.error.wrongColorCode)
                    return
                }
                deccode=int
            } else {
                const int = Number(code)
                if(!int) {
                    await bot.wheatSendErrorMessage(message,lg.error.wrongColorCode)
                    return
                }
                if(int<0||int>16777215) {
                    await bot.wheatSendErrorMessage(message,lg.error.wrongColorCode)
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
    const embed = bot.wheatSampleEmbedGenerate() 
    const attachment = new AttachmentBuilder(canvas.toBuffer(),{name:`${hexa}.png`})
    embed.setTitle(`🎨 ${lg.main.colorCode}: #${hexa}`)
    embed.setDescription(`HEXA: **#${hexa}**\nDEC: **${deccode}**\nRGB: **(${red},${green},${blue})**`)
    embed.setThumbnail(`attachment://${hexa}.png`)
    await bot.wheatEmbedAttachFilesSend(message,[embed],[attachment])
}

module.exports.run = run

module.exports.help = help