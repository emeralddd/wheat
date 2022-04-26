const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')

const help = {
    name:"coinflip",
    group:"random",
    aliases: ["cf","coin","flip","xu","lat","latdongxu","latxu"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message,lg}) => {
	const cf = Math.floor(Math.random()*1310)
	const msg = await bot.wheatSend(message,lg.random.flipping)
    setTimeout(() => {
        msg.edit(`${((cf&1)?lg.random.heads:lg.random.tails)}`)
    },2000) 
}

module.exports.run = run

module.exports.help = help