const bot = require('wheat-better-cmd')
const { MessageActionRow, MessageButton, Message } = require('discord.js')

const help = {
    name:"invite",
    group:"utility",
    aliases: ["inv"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message,lg}) => {
    const embed = await bot.wheatSampleEmbedGenerate(true)
    embed.setTitle(lg.main.inviteBot)
    embed.setDescription(lg.main.inviteToGetBot)
    
    const topgg = new MessageButton()
        .setLabel(lg.main.inviteTopgg)
        .setStyle('LINK')
        .setURL('https://top.gg/bot/798925450562764863')

    const direct = new MessageButton()
        .setLabel(lg.main.inviteDirectly)
        .setStyle('LINK')
        .setURL('https://discord.com/api/oauth2/authorize?client_id=786234973308715008&permissions=4294442871&scope=bot')
    
    const link = new MessageActionRow()
        .addComponents([topgg,direct])
    
    await bot.wheatEmbedButton(message,[embed],[link])
}

module.exports.run = run

module.exports.help = help