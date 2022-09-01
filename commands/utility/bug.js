const { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')


const bot = require('wheat-better-cmd')

const help = {
    name:"bug",
    group:"utility",
    aliases: ["report","baocao","loi"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message,lg}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    embed.setTitle(lg.main.reportBotError)
    embed.setDescription(lg.main.clickLinkToReport)
    const link = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel(lg.main.clickHere)
                .setStyle(ButtonStyle.Link)
                .setURL('https://docs.google.com/forms/d/1QOYrbwJqjZHZElWbq7FIb5HEzsRPJN-PBxx_5hiv5nQ/viewform?edit_requested=true')
                .setEmoji('🐛')
        )
    bot.wheatEmbedButton(message,[embed],[link])
}

module.exports.run = run

module.exports.help = help