const bot = require('wheat-better-cmd');
const moment = require('moment');
const { Client, SlashCommandBuilder } = require('discord.js');
const { Request } = require('../../structure/Request');

const help = {
    name: "whois",
    group: "utility",
    aliases: ["timnguoi", "findinfo", "aila"],
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

        const MEMBER = await request.guild.members.fetch(USER.id);
        embed.setThumbnail(`${USER.avatarURL()}?size=1024`);
        embed.setAuthor({ name: `${USER.username}#${USER.discriminator}` });
        embed.setTitle(`${lg.main.whoIs} ${USER.username}?`);
        embed.setColor(MEMBER.displayHexColor);
        let roleList = "";
        MEMBER.roles.cache.each(role => roleList += `<@&${role.id}> `);
        embed.addFields(
            {
                name: lg.main.displayName,
                value: `${MEMBER.displayName} (<@${MEMBER.id}>)`
            },
            {
                name: lg.main.joinedAt,
                value: moment(MEMBER.joinedAt).format('HH:mm:ss DD/MM/YYYY')
            },
            {
                name: lg.main.createdAt,
                value: moment(USER.createdAt).format('HH:mm:ss DD/MM/YYYY')
            },
            {
                name: lg.main.role,
                value: String(roleList)
            },
            {
                name: lg.main.permissions,
                value: String(MEMBER.permissions.toArray())
            }
        );

        await request.reply({ embeds: [embed] });
    } catch (error) {
        console.log(error);
        await request.reply(lg.error.notFoundThatUser);
        return;
    }
}

module.exports.run = run;

module.exports.help = help;