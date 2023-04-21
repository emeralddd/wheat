const { Message, DiscordAPIError, SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd')
require('dotenv').config

const help = {
    name:"kiss",
    group:"fun",
    aliases: [],
    data: new SlashCommandBuilder()
    .addUserOption(option =>
        option.setName('user')
            .setDescription('mention')
            .setRequired(true)
    )
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {Discord.Client} obj.wheat
 * @param {String[]} obj.args
 */

const run = async ({wheat,message,interaction,args,lg}) => {
    const mentionUsers = await bot.wheatGetUserByIdOrMention(wheat,args ? args[1] : interaction.options.getUser('user').id,'0')

    message = message || interaction
    if(!mentionUsers) {
        await bot.wheatSendErrorMessage(message,lg.error.needToTriggerAtOnePerson)
        return
    }
    const gifArray = require('../../assets/url/gifsURL.json').kiss
    const embed = bot.wheatSampleEmbedGenerate()
    embed.setTitle(`${message.member.displayName} ${lg.fun.kiss} ${mentionUsers.username}`)
    embed.setImage(bot.wheatRandomElementFromArray(gifArray))
    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help