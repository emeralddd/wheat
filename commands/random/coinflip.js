const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')

const help = {
    name:"coinflip",
    htu:"",
    des:"Lật một đồng xu",
    group:"random",
    aliases: ["cf","coin","flip","xu","lat","latdongxu","latxu"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message}) => {
	const cf = Math.floor(Math.random()*1310)
	const msg = await bot.wheatSend(message,`Đang tung đồng xu`)
    setTimeout(() => {
        msg.edit(`${((cf&1)?'Ngửa':'Sấp')}`)
    },2000) 
}

module.exports.run = run

module.exports.help = help