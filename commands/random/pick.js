const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')

const help = {
    name:"pick",
    htu:" <Lựa chọn 1>,<Lựa chọn 2>,[Lựa chọn 3],[Lựa chọn 4],...",
    des:"Chọn một trong các lựa chọn",
    group:"random",
    aliases: ["choose","chon"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String} obj.msg
 * @param {String} obj.prefix
 */

const run = async ({message,msg,prefix}) => {
	let ls = msg.substr(prefix.length)
	for(let i=0; i<ls.length; i++) {
		const now = ls[i]+ls[i+1]+ls[i+2]+ls[i+3]
		if(now.toUpperCase()==='PICK') {
			ls = ls.substr(i+4)
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
        await bot.wheatSendErrorMessage(message,`Chưa nhập đủ dữ liệu, cần có ít nhất 2 lựa chọn!`)
        return 
    }

	const item = list[Math.floor(Math.random() * list.length)]
	if(item==="") item=" "
	await bot.wheatSend(message,`Tôi chọn: **${item}**`)
}

module.exports.run = run

module.exports.help = help