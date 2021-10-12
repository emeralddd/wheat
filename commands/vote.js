const bot = require('wheat-better-cmd')
const { MessageActionRow, MessageButton, ButtonInteraction } = require('discord.js')

const help = {
  name:"vote",
  htu:"",
  des:"Vote cho Bot tại Top.gg!",
  group:"utility",
  aliases: ["topgg"]
}

const run = async ({message}) => {
    const embed = await bot.wheatSampleEmbedGenerate(true)
    embed.setTitle(`VOTE cho Bot!`)
    embed.setDescription(`Vote để ủng hộ thêm cho bot nha!!`)
    const link = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel('Vote Ngay')
                .setStyle('LINK')
                .setURL('https://top.gg/bot/786234973308715008/vote')
                .setEmoji('895593639449853962')
        )
    await bot.wheatEmbedButton(message,[embed],[link])
}

module.exports.run = run

module.exports.help = help