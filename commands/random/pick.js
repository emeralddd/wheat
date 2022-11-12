const { Message, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js')
const bot = require('wheat-better-cmd')

const help = {
    name:"pick",
    group:"random",
    aliases: ["choose","chon"],
    data: new SlashCommandBuilder()
		.addStringOption(option =>
			option.setName('choices')
				.setDescription('<choice 1>,<choice 2>,[choice 3],[choice 4],...,[choice n]')
				.setRequired(true)
		)
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 * @param {String} obj.msg
 * @param {String} obj.prefix
 */

const run = async ({message,interaction,msg,prefix,lg}) => {
	let ls = ""
	
	if(message) {
		ls = msg.substring(prefix.length)
		for(let i=0; i<ls.length; i++) {
			const now = ls[i]+ls[i+1]+ls[i+2]+ls[i+3]
			if(now.toUpperCase()==='PICK') {
				ls = ls.substring(i+4)
				break
			}
		}
	} else {
		ls = interaction.options.getString('choices')
	}

	message||=interaction

	ls+=','
	
	let temp=" "
	let list = []
	
	for(let i of ls) {
		if(i!==',') temp+=i
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