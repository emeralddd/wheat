const { SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const { Request } = require('../../structure/Request');
require('dotenv').config;

const help = {
    name: "slap",
    group: "fun",
    aliases: [],
    example: [" 786234973308715008"],
    data: new SlashCommandBuilder()
        .addUserOption(option =>
            option.setName('user')
                .setDescription('select user')
                .setDescriptionLocalization('vi', 'chọn người dùng')
                .setRequired(true)
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {Discord.Client} obj.wheat
 * @param {String[]} obj.args
 */

const run = async ({ wheat, request, args, t }) => {
    const mentionUsers = await bot.wheatGetUserByIdOrMention(wheat, args ? args[1] : request.interaction.options.getUser('user').id, '0');

    if (!mentionUsers) {
        await request.reply(t('error.needToTriggerAtOnePerson'));
        return;
    }
    const gifArray = require('../../assets/url/gifsURL.json').slap;
    const embed = bot.wheatSampleEmbedGenerate();
    embed.setTitle(`${request.member.displayName} ${t('fun.slap')} ${mentionUsers.username}`);
    embed.setImage(bot.wheatRandomElementFromArray(gifArray));
    await request.reply({ embeds: [embed] });
}

module.exports.run = run;

module.exports.help = help;