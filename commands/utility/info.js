const { Client, Message, ChatInputCommandInteraction } = require('discord.js');
const moment = require('moment');
const bot = require('wheat-better-cmd');
require('dotenv').config({ path: 'secret.env' });

const help = {
    name: "info",
    group: "utility",
    aliases: ["thongtin"]
};

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 * @param {Array} obj.helpMenu
 */

const run = async ({ wheat, message, interaction, lg }) => {
    message ||= interaction;
    const embed = bot.wheatSampleEmbedGenerate(true);
    embed.setAuthor({ name: `Wheat#1261`, iconUrl: process.env.AVATAR });
    embed.setTitle(lg.main.aboutMe);
    embed.setDescription(lg.main.botDescription);
    const uptime_milli = moment.duration(wheat.uptime, 'milliseconds');
    const promises = [
        await wheat.shard.fetchClientValues('guilds.cache.size'),
    ];

    const guildCount = await Promise.all(promises)
        .then(results => {
            return results[0].reduce((acc, guildCount) => acc + guildCount, 0);
        })
        .catch(console.error);

    const count = 48;

    const version = require('../../logs/overview.json').latest;

    let uptime = "";

    if (Math.floor(uptime_milli.asDays()) !== 0) uptime += ` ${Math.floor(uptime_milli.asDays())}d${Math.floor(uptime_milli.asDays()) === 1 ? '' : 's'}`;
    if (Math.floor(uptime_milli.asHours()) !== 0) uptime += ` ${Math.floor(uptime_milli.asHours()) % 24}h${Math.floor(uptime_milli.asHours()) === 1 ? '' : 's'}`;
    if (Math.floor(uptime_milli.asMinutes()) !== 0) uptime += ` ${Math.floor(uptime_milli.asMinutes()) % 60}min${Math.floor(uptime_milli.asMinutes()) === 1 ? '' : 's'}`;
    if (Math.floor(uptime_milli.asSeconds()) !== 0) uptime += ` ${Math.floor(uptime_milli.asSeconds()) % 60}sec${Math.floor(uptime_milli.asSeconds()) === 1 ? '' : 's'}`;


    embed.addFields(
        {
            name: lg.main.generation,
            value: require(`../../logs/${version}.json`).gen,
            inline: true
        },
        {
            name: lg.main.version,
            value: version,
            inline: true
        },
        {
            name: lg.main.build,
            value: require('../../package.json').version,
            inline: true
        },
        {
            name: lg.main.shards,
            value: process.env.shards,
            inline: true
        },
        {
            name: lg.main.servers,
            value: String(guildCount),
            inline: true
        },
        {
            name: lg.main.commands,
            value: String(count),
            inline: true
        },
        {
            name: lg.main.uptime,
            value: uptime,
            inline: true
        },
        {
            name: lg.main.developer,
            value: `darkemeralddd`,
            inline: true
        },
    );
    await bot.wheatEmbedSend(message, [embed]);
}

module.exports.run = run;

module.exports.help = help;