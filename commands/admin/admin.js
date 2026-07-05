const { Client } = require('discord.js');
const { Request } = require('../../structure/Request');

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

module.exports.run = async ({ wheat, request, args }) => {
    if (args[1] === 'lists' && request.author.id === '687301490238554160') {
        const tmp = await wheat.cluster.broadcastEval(c => {
            return c.guilds.cache.filter(g => g.memberCount > 10000);
        });

        for (let i of tmp) {
            for (let j of i) {
                console.log(`name: ${j.name} - ${j.iconURL} - ${j.memberCount}`);
            }
        }
    }

    if (args[1] === 'gg' && request.author.id === '687301490238554160') {
        const res = await wheat.cluster.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0));
        console.log(res);
        console.log(res.reduce((acc, memberCount) => acc + memberCount, 0));
    }
}

module.exports.help = {
    name: "admin",
    htu: "",
    des: "",
    group: "",
    aliases: []
}
