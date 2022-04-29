const bot = require('wheat-better-cmd')
const { MessageActionRow, MessageButton, Message } = require('discord.js')

const help = {
    name:"support",
    group:"utility",
    aliases: ["hotro"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message,lg}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    embed.setAuthor({name:`Wheat#1261`,iconUrl:process.env.AVATAR})
    embed.setTitle(lg.main.needHelp)
    embed.setDescription(lg.main.supportDetails)
    embed.addFields(
        {
            name: lg.main.dmDeveloper,
            value: `<@687301490238554160>`,
            inline: true
        }
    )
    const button = new MessageButton()
        .setLabel(lg.main.submitTicket)
        .setStyle('LINK')
        .setURL('https://docs.google.com/forms/d/1EwycxNOkf0lJasyiyDj6G1AT9CDSJtvcLwYTcF9dk9c/viewform?edit_requested=true')
        .setEmoji('🎟️')

    const join2 = new MessageButton()
        .setLabel(lg.main.supportServer)
        .setStyle('LINK')
        .setURL('https://discord.gg/z5Z4uzmED9')
        .setEmoji('895590343356084224')
    
    const link = new MessageActionRow()
        .addComponents([button,join2])

    await bot.wheatEmbedButton(message,[embed],[link])
}

module.exports.run = run

module.exports.help = help