const bot = require('wheat-better-cmd')
const { MessageActionRow, MessageButton, Message } = require('discord.js')

const help = {
    name:"invite",
    htu:"",
    des:"Invite Bot!",
    group:"utility",
    aliases: ["inv"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message}) => {
    const embed = await bot.wheatSampleEmbedGenerate(true)
    embed.setTitle(`INVITE Bot!`)
    embed.setDescription(`Invite bot để sử dụng những tính năng thú vị nhất trong chính server của bạn!`)
    
    const topgg = new MessageButton()
        .setLabel('Invite thông qua Top.gg!')
        .setStyle('LINK')
        .setURL('https://top.gg/bot/798925450562764863')

    const direct = new MessageButton()
        .setLabel('Invite trực tiếp!')
        .setStyle('LINK')
        .setURL('https://discord.com/api/oauth2/authorize?client_id=786234973308715008&permissions=4294442871&scope=bot')
    
    const link = new MessageActionRow()
        .addComponents([topgg,direct])
    
    await bot.wheatEmbedButton(message,[embed],[link])
}

module.exports.run = run

module.exports.help = help