const bot = require('wheat-better-cmd')
const {MessageAttachment, Message} = require('discord.js')
const moment = require('moment')

const help = {
    name:"rdate",
    htu:" [<DD/MM/YYYY> <DD/MM/YYYY>]",
    des:"Đưa ra một ngày bất kỳ từ 1/1/1970 đến ngày hiện tại hoặc trong khoảng nhập vào trước",
    group:"random",
    aliases: ["randomdate","ngaunhienngay","datebetween"]
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
        first = moment(args[1],'DD/MM/YYYY',true).unix()
        last = moment(args[2],'DD/MM/YYYY',true).unix()
    } else {
        await bot.wheatSendErrorMessage(message,`Dữ liệu nhập vào không hợp lệ!`)
        return
    }

    if((!first&&first!=0)||(!last&&last!=0)) {
        await bot.wheatSendErrorMessage(message,`Dữ liệu nhập vào không hợp lệ!`)
        return
    }
    
    if(first>last) {
        await bot.wheatSendErrorMessage(message,`Thời điểm trước phải trước thời điểm sau!`)
        return
    }

    console.log(`first: ${first} last: ${last}`)
    const choose = bot.wheatRandomNumberBetween(first,last)
    console.log(`ch: ${choose}`)
    await bot.wheatSend(message,`Ngày ngẫu nhiên được chọn là: ${moment.unix(choose).format("DD/MM/YYYY")}`)
}

module.exports.run = run

module.exports.help = help