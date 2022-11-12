const bot = require('wheat-better-cmd')
const { ActionRowBuilder, ButtonBuilder, Message, ButtonStyle } = require('discord.js')

const help = {
    name:"invite",
    group:"utility",
    aliases: ["inv"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message,interaction,lg}) => {
    message||=interaction
    const embed = bot.wheatSampleEmbedGenerate(true)
    embed.setTitle(lg.main.inviteBot)
    embed.setDescription(lg.main.inviteToGetBot)
    
    const topgg = new ButtonBuilder()
        .setLabel(lg.main.inviteTopgg)
        .setStyle(ButtonStyle.Link)
        .setURL('https://top.gg/bot/798925450562764863')

    const direct = new ButtonBuilder()
        .setLabel(lg.main.inviteDirectly)
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.com/api/oauth2/authorize?client_id=786234973308715008&permissions=4294442871&scope=bot')
    
    const link = new ActionRowBuilder()
        .addComponents([topgg,direct])
    
    await bot.wheatEmbedButton(message,[embed],[link])
}

module.exports.run = run

module.exports.help = help