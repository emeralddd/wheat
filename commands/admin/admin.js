const {Client, Message} = require('discord.js')

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

module.exports.run = async ({wheat, message, args}) => {
    if (args[1]=== 'lists'&&message.author.id === '687301490238554160') {
        const tmp = await wheat.shard.broadcastEval(c => {
            return c.guilds.cache.filter(g => g.memberCount>10000)
        })

        for(let i of tmp) {
            for(let j of i) {
                console.log(`name: ${j.name} - ${j.iconURL} - ${j.memberCount}`)
            }
        }

        // console.log(tmp)
	}
    if (args[1] === 'count' &&message.author.id === '687301490238554160') 
    {
		message.channel.send(String(wheat.guilds.cache.size));
        wheat.shard.fetchClientValues('guilds.cache.size')
            .then(results => {
                console.log(`${results.reduce((acc, guildCount) => acc + guildCount, 0)} total guilds`);
            })
            .catch(console.error);

        return;
	}
    if(args[1]==='gg' && message.author.id === '687301490238554160') {
        // console.log(wheat.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))

        const res = await wheat.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))

        console.log(res)

        console.log(res.reduce((acc, memberCount) => acc + memberCount, 0))
    }
}

module.exports.help = {
    name:"admin",
    htu:"",
    des:"abc",
    group:"",
    aliases: [""]
}
