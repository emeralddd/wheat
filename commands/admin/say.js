const {Message, Client} = require('discord.js');

const help = {
	name:"say",
    htu:"",
    des:"",
    group:"",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {Client} obj.wheat
 * @param {String[]} obj.args
 */

const run = async ({wheat,message,interaction,args}) => {
    if(message.author.id!=='687301490238554160') return;
    let talk="";
    for(let i=2; i<args.length; i++)
        talk+=args[i]+" ";

    const fnc = eval(`async(sub) => {
        const channel = await sub.channels.cache.get('${args[1]}');
        if(channel) channel.send('${talk}');
    }`);
    
    wheat.shard.broadcastEval(fnc);
}

module.exports.run = run;

module.exports.help = help;