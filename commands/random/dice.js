const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')

const help = {
    name:"dice",
    group:"random",
    aliases: ["xucxac","xingau","doxingau","tungxucxac","xn","xx"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

const run = async ({message,args,lg}) => {
    let rd=[]
    for(let face of args) {
        if(Number(face)) {
            rd.push({
                face: face, 
                dice: Math.floor(Math.random()*Number(face)+1)
            })
        }
    }
    if(rd.length===0) rd.push({face: 6, dice: Math.floor(Math.random()*6+1)})

    let sf="",sd="",sum=0
    rd.forEach(e => {
        sf+=e.face+" "
        sd+=String(e.dice)+" "
        sum+=e.dice;
    })

	await bot.wheatSend(message,`${lg.random.dices} ${sf}${lg.random.dicesResult} ${sd}. ${lg.random.sumIs}: ${sum}`) 
}

module.exports.run = run

module.exports.help = help