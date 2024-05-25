const bot = require('wheat-better-cmd');
const { Client } = require('discord.js');
const { Request } = require('../../structure/Request');

const help = {
    name: "shard",
    group: "utility",
    aliases: ['shards'],
};

/**
 * @param {object} obj
 * @param {String[]} obj.S
 * @param {Request} obj.request
 * @param {Client} obj.wheat
 */

const run = async ({ wheat, request, lg }) => {
    const shardList = await wheat.shard.broadcastEval(subWheat => {
        const moment = require('moment');
        const uptime = moment.duration(subWheat.uptime, 'milliseconds');
        let uptimeString = "";
        if (Math.floor(uptime.asDays()) !== 0) uptimeString += ` ${Math.floor(uptime.asDays())}d${Math.floor(uptime.asDays()) === 1 ? '' : 's'}`;
        if (Math.floor(uptime.asHours()) !== 0) uptimeString += ` ${Math.floor(uptime.asHours()) % 24}h${Math.floor(uptime.asHours()) === 1 ? '' : 's'}`;
        if (Math.floor(uptime.asMinutes()) !== 0) uptimeString += ` ${Math.floor(uptime.asMinutes()) % 60}min${Math.floor(uptime.asMinutes()) === 1 ? '' : 's'}`;
        if (Math.floor(uptime.asSeconds()) !== 0) uptimeString += ` ${Math.floor(uptime.asSeconds()) % 60}sec${Math.floor(uptime.asSeconds()) === 1 ? '' : 's'}`;

        return {
            guilds: subWheat.guilds.cache.size,
            uptime: uptimeString
        }
    });

    const embed = bot.wheatSampleEmbedGenerate();
    embed.setAuthor({ name: `Wheat#1261`, iconURL: process.env.AVATAR });
    embed.setTitle('Shard list');

    for (let i = 0; i < shardList.length; i++) {
        embed.addFields({
            name: `Shard ${i}`,
            value: `Guilds: ${shardList[i].guilds}\nUptime: ${shardList[i].uptime}`,
            inline: true
        });
    }

    embed.setFooter({
        text: `From shard ${wheat.shard.ids[0]}!`
    });

    await request.reply({ embeds: [embed] });
}

module.exports.run = run;

module.exports.help = help;