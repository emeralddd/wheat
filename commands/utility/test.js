const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')
const axios = require('axios').default
require('dotenv').config({path: 'secret.env'})

const help = {
    status:"dev",
    name:"test",
    group:"fun",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message,args,commandsList}) => {
    console.log(process.env.HI)
}

module.exports.run = run

module.exports.help = help