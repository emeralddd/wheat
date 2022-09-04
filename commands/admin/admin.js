const {Client, Message} = require('discord.js')

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

module.exports.run = async ({wheat, message, args}) => {
    if (args[1]=== 'lists'&&message.author.id === '687301490238554160') {
		let s = '';
        let t=0;
		wheat.guilds.cache.each(w => {
			if(t===5) 
            {
                message.channel.send(s);
                s='',t=0;
            }
            s+=w.name + ' owner: <@' + w.ownerID + '> member:' + w.memberCount + '\n';
            t++;
		});
        message.channel.send(s);
        return;
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
        console.log(wheat.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
    }
}

module.exports.help = {
    name:"admin",
    htu:"",
    des:"abc",
    group:"",
    aliases: [""]
}
