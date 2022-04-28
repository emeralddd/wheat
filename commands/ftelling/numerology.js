const bot = require('wheat-better-cmd')
const {MessageAttachment, Message} = require('discord.js')
const moment = require('moment')

const help = {
    name:"numerology",
    group:"ftelling",
    aliases: ["thansohoc","tsh","nhansohoc","nsh"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

const run = async ({message,args,lg}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    const embed1 = await bot.wheatSampleEmbedGenerate()
    const date = args[1]
    const mmt =moment(date,'DD/MM/YYYY',true)
    if(!mmt.isValid()) {
        await bot.wheatSendErrorMessage(message,lg.error.formatError)
        return
    }
    
    const number = await bot.wheatReadJSON('./assets/content/numerologyRulingNumber.json')
    const ngay= mmt.format('DD')
    const thang= mmt.format('MM')
    const nam= mmt.format('YYYY')
    let temp=ngay+thang+nam
    let tmp=0
    for(let i=0; i<temp.length; i++) {
        tmp+=Number(temp[i])
    }
    temp=tmp
    while(temp!=22&&temp>11) {
        tmp=temp
        temp=0
        while(tmp!=0) {
            temp+=tmp%10
            tmp=Math.floor(tmp/10)
        }
    }

    const num = number[temp]
    if(temp===22) temp="22/4"
	embed.setTitle(`▩ ${message.member.displayName}, ${lg.fortune.yourRullingNumberIs} **${temp}**`)
    if(temp==="22/4") temp=22
	embed.setDescription(num.description)
    embed.fields=[]
    embed1.fields=[]
    embed1.setFooter({text:lg.fortune.numerologyDetails})
    embed.addFields({
            name:`◌ ${lg.fortune.general}`,
            value: num.description
        })
    if(num.desc1) {
        embed.addFields({
            name:`▿`,
            value: num.desc1
        })
    }
    embed.addFields({
            name:`◌ ${lg.fortune.lifePurpose}`,
            value: num.life
        },
        {
            name:`◌ ${lg.fortune.good}`,
            value: num.good
        },
        {
            name:`◌ ${lg.fortune.special}`,
            value: num.special
    })
    if(num.special1) {
        embed.addFields({
            name:`▿`,
            value: num.special1
        })
    }
    embed1.addFields({
            name:`◌ ${lg.fortune.bad}`,
            value: num.bad
        },
        {
            name:`◌ ${lg.fortune.sol}`,
            value: num.sol
    })
    if(num.sol1) {
        embed1.addFields({
            name:`▿`,
            value: num.sol1
        })
    }
    embed1.addFields({
            name:`◌ ${lg.fortune.job}`,
            value: num.job
        }
    )

	const attachment = new MessageAttachment(`./assets/image/numberImage/${temp}.png`,`${temp}.png`)
    embed.setThumbnail(`attachment://${temp}.png`)

    await bot.wheatEmbedAttachFilesSend(message,[embed],[attachment])
    await bot.wheatEmbedSend(message,[embed1])
}

module.exports.run = run

module.exports.help = help