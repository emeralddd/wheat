const { Message, MessageActionRow, MessageButton } = require('discord.js')

const bot = require('wheat-better-cmd')

const help = {
    name:"bug",
    htu:"",
    des:"Lấy link phản hồi về lỗi của bot!",
    group:"utility",
    aliases: ["report","baocao","loi"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    embed.setTitle(`Báo cáo lỗi của bot`)
    embed.setDescription(`Nhấn vào link để báo cáo lỗi của bot! `)
    const link = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel('Bấm vào đây!')
                .setStyle('LINK')
                .setURL('https://docs.google.com/forms/d/1QOYrbwJqjZHZElWbq7FIb5HEzsRPJN-PBxx_5hiv5nQ/viewform?edit_requested=true')
                .setEmoji('🐛')
        )
    bot.wheatEmbedButton(message,[embed],[link])
}

module.exports.run = run

module.exports.help = help