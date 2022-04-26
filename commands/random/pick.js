const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')

const help = {
    name:"pick",
    group:"random",
    aliases: ["choose","chon"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String} obj.msg
 * @param {String} obj.prefix
 */

const run = async ({message,msg,prefix,lg}) => {
	let ls = msg.substr(prefix.length)
	for(let i=0; i<ls.length; i++) {
		const now = ls[i]+ls[i+1]+ls[i+2]+ls[i+3]
		if(now.toUpperCase()==='PICK') {
			ls = ls.substring(i+4)
			break
		}
	}
	
    let temp=" "
    let list = []
	ls+=','
	for(let i of ls) {
		if(i!=',') temp+=i
        else {	
			list.push(temp.trim())
			temp=" "
		}
	}

    if(list.length<2) {
        await bot.wheatSendErrorMessage(message,lg.error.atLeast2Options)
        return 
    }

	const item = list[Math.floor(Math.random() * list.length)]
	if(item==="") item=" "
	await bot.wheatSend(message,`${lg.random.iPick}: **${item}**`)
}

module.exports.run = run

module.exports.help = help