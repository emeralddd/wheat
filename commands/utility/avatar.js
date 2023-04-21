const {Client, Message, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const bot = require('wheat-better-cmd')

const help = {
    name:"avatar",
    group:"utility",
    aliases: ["ava","daidien"],
    rate:1500,
    data: new SlashCommandBuilder()
        .addUserOption(option =>
            option.setName('user')
                .setDescription('mention||id')
        )
}

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 * @param {String[]} obj.args
 */

const run = async ({wheat, message, interaction, args, lg}) => {
    const embed = bot.wheatSampleEmbedGenerate()

    try {
        message||=interaction
        
        const USER = (args?await bot.wheatGetUserByIdOrMention(wheat,args[1],message.member.id):interaction.options.getUser('user')||interaction.user)
        
        if(!USER) {
            await bot.wheatSend(message, lg.error.notFoundThatUser)
            return
        }
        
        embed.setAuthor({name:`${USER.username}#${USER.discriminator}`,iconURL:USER.avatarURL()})
        embed.setImage(`${USER.avatarURL()}?size=1024`)
        await bot.wheatEmbedSend(message,[embed])
    } catch (error) {
        await bot.wheatSend(message, lg.error.notFoundThatUser)
        return
    }
}

module.exports.run = run

module.exports.help = help