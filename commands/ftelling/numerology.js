const bot = require('wheat-better-cmd')
const {MessageAttachment, Message} = require('discord.js')
const moment = require('moment')

const help = {
    name:"numerology",
    htu:" <ngày ở định dạng DD/MM/YYYY>",
    des:"Xem thần số học của ngày sinh, không tin tưởng tất cả!",
    group:"ftelling",
    aliases: ["thansohoc","tsh","nhansohoc","nsh"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

const run = async ({message,args}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    const embed1 = await bot.wheatSampleEmbedGenerate()
    const date = args[1]
    const mmt =moment(date,'DD/MM/YYYY',true)
    if(!mmt.isValid()) {
        await bot.wheatSendErrorMessage(message,`Sai cấu trúc ngày!`)
        return
    }
    
    const number = await bot.wheatReadJSON('./storage/thansohoc.json')
    const ngay= mmt.format('DD')
    const thang= mmt.format('MM')
    const nam= mmt.format('YYYY')
    let temp=ngay+thang+nam
    let tmp=0
    for(let i=0; i<temp.length; i++) {
        //console.log(Number(temp[i]))
        tmp+=Number(temp[i])
    }
    temp=tmp
    //console.log(temp)
    while(temp!=22&&temp>11) {
        tmp=temp
        temp=0
        while(tmp!=0) {
            temp+=tmp%10
            tmp=Math.floor(tmp/10)
            //console.log(tmp)
        }
    }

    const num = number[temp]
    if(temp===22) temp="22/4"
	embed.setTitle(`▩ ${message.member.displayName}, số Chủ Đạo của bạn là số **${temp}**`)
    if(temp==="22/4") temp=22
	embed.setDescription(num.description)
    embed.fields=[]
    embed1.fields=[]
    embed1.setFooter(`Mọi thông tin được nêu trên được tham khảo từ cuốn sách The Complete Book of Numerology – Cuốn sách Toàn diện về Khoa học Số của tác giả David A. Phillips và được dịch, giới thiệu bởi bà Lê Đỗ Quỳnh Hương!`)
    embed.addFields({
            name:`◌ Giới thiệu`,
            value: num.description
        })
    if(num.desc1) {
        embed.addFields({
            name:`▿`,
            value: num.desc1
        })
    }
    embed.addFields({
            name:`Mục đích sống`,
            value: num.life
        },
        {
            name:`◌ Thể hiện tốt nhất`,
            value: num.good
        },
        {
            name:`◌ Nổi bật`,
            value: num.special
    })
    if(num.special1) {
        embed.addFields({
            name:`▿`,
            value: num.special1
        })
    }
    embed1.addFields({
            name:`◌ Nhược Điểm`,
            value: num.bad
        },
        {
            name:`◌ Hướng giải quyết`,
            value: num.sol
    })
    if(num.sol1) {
        embed1.addFields({
            name:`▿`,
            value: num.sol1
        })
    }
    embed1.addFields({
            name:`◌ Nghề nghiệp`,
            value: num.job
        }
    )

    const fileimage = String(temp) + '.png'
	const attachment = new MessageAttachment('./storage/number_image/' + fileimage,fileimage)
    embed.setThumbnail('attachment://'+ fileimage)

    await bot.wheatEmbedAttachFilesSend(message,[embed],[attachment])
    await bot.wheatEmbedSend(message,[embed1])
}

module.exports.run = run

module.exports.help = help