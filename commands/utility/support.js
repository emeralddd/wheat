const bot = require('wheat-better-cmd')
const { MessageActionRow, MessageButton, Message } = require('discord.js')

const help = {
    name:"support",
    htu:"",
    des:"Xem thông tin hỗ trợ!",
    group:"utility",
    aliases: ["hotro"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    embed.setAuthor(`Wheat#1261`,process.env.AVATAR)
    embed.setTitle(`Need help?`)
    embed.setDescription(`Bạn gặp các vấn đề khi sử dụng bot? Hãy liên lạc ngay với đội ngũ phát triển để được giải đáp theo các cách dưới đây!`)
    embed.addFields(
        {
            name: "DM Developer",
            value: `<@687301490238554160>`,
            inline: true
        }
    )
    const button = new MessageButton()
        .setLabel('Submit Ticket!')
        .setStyle('LINK')
        .setURL('https://docs.google.com/forms/d/1EwycxNOkf0lJasyiyDj6G1AT9CDSJtvcLwYTcF9dk9c/viewform?edit_requested=true')
        .setEmoji('🎟️')

    /*const join1 = new MessageButton()
        .setLabel('Support Server')
        .setStyle('LINK')
        .setURL('https://discord.gg/s3WX35n6ys')
        .setEmoji('895590343356084224')*/

    const join2 = new MessageButton()
        .setLabel('Support Server')
        .setStyle('LINK')
        .setURL('https://discord.gg/z5Z4uzmED9')
        .setEmoji('895590343356084224')
    
    const link = new MessageActionRow()
        .addComponents([button,join2])

    await bot.wheatEmbedButton(message,[embed],[link])
}

module.exports.run = run

module.exports.help = help