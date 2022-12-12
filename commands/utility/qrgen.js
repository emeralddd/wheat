const bot = require('wheat-better-cmd')
const qrcode = require('qrcode')
const { AttachmentBuilder, Message, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js')

const help = {
    name:"qrgen",
    group:"utility",
    aliases: ["taoqr","qrgenerator","qr"],
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('content')
                .setDescription('length<1601')
                .setRequired(true)
        )
}

/**
 * @param {object} obj
 * @param {String[]} obj.S
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 */

const run = async ({S, message, interaction, lg}) => {
    const embed = bot.wheatSampleEmbedGenerate()
    
    let content=""

    if(message) {
        let block=true
        // console.log(S)
        for(let i=0; i<S.length; i++) {
            if(S[i]!==''&&block) {
                block=false
                continue
            }
            if(!block) {
                content+=S[i]+" "
            }
        }

        content = content.trimStart().trimEnd()
    } else {
        content=interaction.options.getString('content')
    }

    message||=interaction
    
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
        const attachment = new AttachmentBuilder(buffer,{name:'qr.png'})
        embed.setImage('attachment://qr.png')
        embed.setTitle(lg.main.successExecution)
        embed.setDescription(content)
        await bot.wheatEmbedAttachFilesSend(message,[embed],[attachment])
    })
}

module.exports.run = run

module.exports.help = help