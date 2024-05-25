const { Client, SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const { Request } = require('../../structure/Request');

const help = {
    name: "avatar",
    group: "utility",
    aliases: ["ava", "daidien"],
    rate: 1500,
    data: new SlashCommandBuilder()
        .addUserOption(option =>
            option.setName('user')
                .setDescription('mention||id')
        )
}

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ wheat, request, args, lg }) => {
    const embed = bot.wheatSampleEmbedGenerate();

    try {
        const USER = (request.isMessage ? await bot.wheatGetUserByIdOrMention(wheat, args[1], request.member.id) : request.interaction.options.getUser('user') || request.author);

        if (!USER) {
            await request.reply(lg.error.notFoundThatUser);
            return;
        }

        embed.setAuthor({ name: `${USER.username}`, iconURL: USER.avatarURL() });
        embed.setImage(`${USER.avatarURL()}?size=1024`);
        await request.reply({ embeds: [embed] });
    } catch (error) {
        await request.reply(lg.error.notFoundThatUser);
        return;
    }
}

module.exports.run = run;

module.exports.help = help;