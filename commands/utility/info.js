const { Client } = require('discord.js');
const moment = require('moment');
const bot = require('wheat-better-cmd');
const { Request } = require('../../structure/Request');
require('dotenv').config({ path: 'secret.env' });

const help = {
    name: "info",
    group: "utility",
    aliases: ["thongtin"]
};

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Request} obj.request
 */

const run = async ({ wheat, request, t }) => {
    const embed = bot.wheatSampleEmbedGenerate(true);
    embed.setAuthor({ name: `Wheat#1261`, iconURL: process.env.AVATAR });
    embed.setTitle(t('main.aboutMe'));
    embed.setDescription(t('main.botDescription'));
    const uptime_milli = moment.duration(wheat.uptime, 'milliseconds');
    const promises = [
        await wheat.shard.fetchClientValues('guilds.cache.size'),
    ];

    const guildCount = await Promise.all(promises)
        .then(results => {
            return results[0].reduce((acc, guildCount) => acc + guildCount, 0);
        })
        .catch(console.error);

    const count = 51;

    const version = require('../../logs/overview.json').latest;

    let uptime = "";

    if (Math.floor(uptime_milli.asDays()) !== 0) uptime += ` ${Math.floor(uptime_milli.asDays())}d${Math.floor(uptime_milli.asDays()) === 1 ? '' : 's'}`;
    if (Math.floor(uptime_milli.asHours()) !== 0) uptime += ` ${Math.floor(uptime_milli.asHours()) % 24}h${Math.floor(uptime_milli.asHours()) === 1 ? '' : 's'}`;
    if (Math.floor(uptime_milli.asMinutes()) !== 0) uptime += ` ${Math.floor(uptime_milli.asMinutes()) % 60}min${Math.floor(uptime_milli.asMinutes()) === 1 ? '' : 's'}`;
    if (Math.floor(uptime_milli.asSeconds()) !== 0) uptime += ` ${Math.floor(uptime_milli.asSeconds()) % 60}sec${Math.floor(uptime_milli.asSeconds()) === 1 ? '' : 's'}`;

    embed.addFields(
        {
            name: t('main.generation'),
            value: require(`../../logs/${version}.json`).gen,
            inline: true
        },
        {
            name: t('main.version'),
            value: version,
            inline: true
        },
        {
            name: t('main.build'),
            value: require('../../package.json').version,
            inline: true
        },
        {
            name: t('main.shards'),
            value: process.env.shards,
            inline: true
        },
        {
            name: t('main.servers'),
            value: String(guildCount),
            inline: true
        },
        {
            name: t('main.commands'),
            value: String(count),
            inline: true
        },
        {
            name: t('main.uptime'),
            value: uptime,
            inline: true
        },
        {
            name: t('main.developer'),
            value: `darkemeralddd`,
            inline: true
        },
    );
    await request.reply({ embeds: [embed] });
}

module.exports.run = run;

module.exports.help = help;