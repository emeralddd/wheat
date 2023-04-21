const bot = require('wheat-better-cmd')
const {AttachmentBuilder, Message, SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags} = require('discord.js');
const moment = require('moment')

const help = {
    name:"numerology",
    group:"ftelling",
    aliases: ["thansohoc","tsh","nhansohoc","nsh"],
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('date')
                .setDescription('<DD/MM/YYYY>')
                .setRequired(true)
        )
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 * @param {String[]} obj.args
 */

const run = async ({message,interaction,args,lg}) => {
    const embed = bot.wheatSampleEmbedGenerate()
    const embed1 = bot.wheatSampleEmbedGenerate()
    const date = args?args[1]:interaction.options.getString('date')

    message = message || interaction

    const mmt =moment(date,'DD/MM/YYYY',true)
    if(!mmt.isValid()) {
        await bot.wheatSendErrorMessage(message,lg.error.formatError)
        return
    }
    
    const number = await bot.wheatReadJSON('./assets/content/numerologyRulingNumber_new.json')
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

    // const arr=[2,3,4,5,6,7,8,9,10,11,22]

    // for(let i=8; i<arr.length; i++) {

    const num = number[temp]
    // const num=number[arr[i]]

    if(temp===22) temp="22/4"

	embed.setTitle(`▩ ${message.member.displayName}, ${lg.fortune.yourRullingNumberIs} **${temp}**`)
    if(temp==="22/4") temp=22
	embed.setDescription(num.description)
    embed.data.fields=[]
    embed1.data.fields=[]
    embed1.setFooter({text:lg.fortune.numerologyDetails})

    embed.addFields({
            name:`◌ ${lg.fortune.lifePurpose}`,
            value: num.lifePurpose
        },
        {
            name:`◌ ${lg.fortune.good}`,
            value: num.bestExpression
        },
        {
            name:`◌ ${lg.fortune.special}`,
            value: num.distinctiveTraits
    })
    if(num.distinctiveTraits1) {
        embed.addFields({
            name:`▿`,
            value: num.distinctiveTraits1
        })
    }
    embed1.addFields({
            name:`◌ ${lg.fortune.bad}`,
            value: num.negative
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
        },
        {
            name:`◌ ${lg.fortune.summary}`,
            value: num.summary
        }
    )

    // console.log(embed);

	const attachment = new AttachmentBuilder(`./assets/image/numberImage/${temp}.png`,`${temp}.png`)
    embed.setThumbnail(`attachment://${temp}.png`)

    await bot.wheatEmbedAttachFilesSend(message,[embed],[attachment])

    await message.channel.send({embeds:[embed1]});

    // await bot.wheatEmbedSend(message,[embed1])

    // }
}

module.exports.run = run

module.exports.help = help