const {Client, Message} = require('discord.js');

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

module.exports.run = async ({wheat, message, args}) => {
    if (message.author.id === '687301490238554160') {
		const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
        return;
	}
}

module.exports.help = {
    name:"ram",
    htu:"",
    des:"abc",
    group:"",
    aliases: [""]
}
