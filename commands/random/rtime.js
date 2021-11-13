const bot = require('wheat-better-cmd')
const {MessageAttachment, Message} = require('discord.js')
const moment = require('moment')

const help = {
    name:"rtime",
    htu:" [<hh:mm> <hh:mm>]",
    des:"Đưa ra một thời gian bất kỳ trong ngày hoặc trong khoảng nhập vào (thời gian ở định dạng 24 giờ, bắt đầu từ 0)",
    group:"random",
    aliases: ["randomtime","ngaunhiengio","timebetween"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

const run = async ({message,args}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    let first,last
    if(args.length===1) {
        first = 0
        last = Date.now()
    } else if(args.length===3) {
        first = moment(`${args[1]} 05/01/1970`,'HH:mm DD/MM/YYYY',true).unix()
        last = moment(`${args[2]} 05/01/1970`,'HH:mm DD/MM/YYYY',true).unix()
    } else {
        await bot.wheatSendErrorMessage(message,`Dữ liệu nhập vào không hợp lệ!`)
        return
    }

    console.log(`first: ${first} last: ${last}`)

    if((!first&&first!=0)||(!last&&last!=0)) {
        await bot.wheatSendErrorMessage(message,`Dữ liệu nhập vào không hợp lệ!`)
        return 
    }
    
    if(first>last) {
        await bot.wheatSendErrorMessage(message,`Thời điểm trước phải trước thời điểm sau!`)
        return
    }

    const choose = bot.wheatRandomNumberBetween(first,last)
    console.log(`ch: ${choose}`)
    await bot.wheatSend(message,`Giờ ngẫu nhiên được chọn là: ${moment.unix(choose).format("hh:mm")}`)
}

module.exports.run = run

module.exports.help = help