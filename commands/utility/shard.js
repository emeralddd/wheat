const bot = require('wheat-better-cmd');
const { Client } = require('discord.js');
const { Request } = require('../../structure/Request');

const help = {
    name: "shard",
    group: "utility",
    aliases: ['shards','cluster','clusters'],
};

/**
 * @param {object} obj
 * @param {String[]} obj.S
 * @param {Request} obj.request
 * @param {Client} obj.wheat
 */

const run = async ({ wheat, request, t }) => {
    const shardList = await wheat.cluster.broadcastEval(subWheat => {
        const moment = require('moment');
        const uptime = moment.duration(subWheat.uptime, 'milliseconds');
        let uptimeString = "";
        if (Math.floor(uptime.asDays()) !== 0) uptimeString += ` ${Math.floor(uptime.asDays())}d${Math.floor(uptime.asDays()) === 1 ? '' : 's'}`;
        if (Math.floor(uptime.asHours()) !== 0) uptimeString += ` ${Math.floor(uptime.asHours()) % 24}h${Math.floor(uptime.asHours()) === 1 ? '' : 's'}`;
        if (Math.floor(uptime.asMinutes()) !== 0) uptimeString += ` ${Math.floor(uptime.asMinutes()) % 60}min${Math.floor(uptime.asMinutes()) === 1 ? '' : 's'}`;
        if (Math.floor(uptime.asSeconds()) !== 0) uptimeString += ` ${Math.floor(uptime.asSeconds()) % 60}sec${Math.floor(uptime.asSeconds()) === 1 ? '' : 's'}`;

        return {
            shards: subWheat.cluster.shardList,
            guilds: subWheat.guilds.cache.size,
            uptime: uptimeString
        }
    });

    const embedList = [];

    let shardPage = 0;
    
    for (let i = 0; i < shardList.length; i++) {
        if (i % 25 === 0) {
            shardPage++;

            const embed = bot.wheatSampleEmbedGenerate();
            embed.setAuthor({ name: `Wheat#1261`, iconURL: process.env.AVATAR });
            embed.setTitle(`Cluster Shard list - Page ${shardPage}`);

            embedList.push(embed);
        }

        embedList[shardPage - 1].addFields({
            name: `Cluster ${i}`,
            value: `Managed shard: ${shardList[i].shards.join(', ')}\nGuilds: ${shardList[i].guilds}\nUptime: ${shardList[i].uptime}`,
            inline: true
        });
    }

    embedList[shardPage - 1].setFooter({
        text: t('main.fromShard', { shardId: request.guild.shardId })
    });

    await request.reply({ embeds: embedList });
}

module.exports.run = run;

module.exports.help = help;