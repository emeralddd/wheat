const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')

const help = {
    name:"rand",
    htu:" [giới hạn nhỏ nhất (lớn nhất)] [giới hạn lớn nhất]",
    des:"Đưa ra một số ngẫu nhiên trong khoảng được cho trước",
    group:"random",
    aliases: ["rd","ngaunhien","batky","rdm","r"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

const run = async ({message,args}) => {
    let numberMIN = Number(args[1])
	let numberMAX = Number(args[2])
    
	if(!numberMIN&&numberMIN!=0) {
		numberMIN=1
		numberMAX=100
	}
	
    if(!numberMAX&&numberMAX!=0) {
		numberMAX=numberMIN
		numberMIN=1
	}

    if(numberMIN>numberMAX) {
        const temp=numberMIN
        numberMIN=numberMAX
        numberMAX=temp
    }

	const randomNumber = Math.floor(Math.random()*(numberMAX-numberMIN+1)+numberMIN)
	await bot.wheatSend(message,`Số ngẫu nhiên trong khoảng [${numberMIN},${numberMAX}] là: ${randomNumber}`) 
}

module.exports.run = run

module.exports.help = help