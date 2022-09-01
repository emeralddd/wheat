const bot = require('wheat-better-cmd')
const { ActionRowBuilder, ButtonBuilder, ButtonInteraction, Message, ButtonStyle } = require('discord.js')

const help = {
  name:"vote",
  group:"utility",
  aliases: ["topgg"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message}) => {
    const embed = await bot.wheatSampleEmbedGenerate(true)
    embed.setTitle(`VOTE cho Bot!`)
    embed.setDescription(`Vote để ủng hộ thêm cho bot nha!!`)
    const link = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Vote Ngay')
                .setStyle(ButtonStyle.Link)
                .setURL('https://top.gg/bot/786234973308715008/vote')
                .setEmoji('895593639449853962')
        )
    await bot.wheatEmbedButton(message,[embed],[link])
}

module.exports.run = run

module.exports.help = help