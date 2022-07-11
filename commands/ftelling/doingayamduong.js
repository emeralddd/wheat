// const {Message} = require('discord.js')
// const {convertAmDuong} = require('../../modules/getLunarDate')
// const bot = require('wheat-better-cmd')
// const moment = require('moment')
 
// const help = {
//     status:'dev',
//     name:"doingayamduong",
//     group:"ftelling",
//     aliases: ["amduong"]
// }

// /**
// * @param {object} obj
// * @param {Message} obj.message
// */

// const run = async ({message,args,lg,lang}) => {
//     const embed = await bot.wheatSampleEmbedGenerate()
//     const date = args[1]
//     const mmt = moment(date,'DD/MM/YYYY',true)
//     if(!mmt.isValid()) {
//         await bot.wheatSendErrorMessage(message,lg.error.formatError)
//         return
//     }
    
//     const ngay = Number(mmt.format('DD'))
//     const thang = Number(mmt.format('MM'))
//     const nam = Number(mmt.format('YYYY'))

//     const solar = convertAmDuong(ngay,thang,nam,0,7)

//     // const mmt2 = moment(``)

//     // console.log(solar)

//     // await bot.wheatSend(message,solar)

//     const month = ["","January","February","March","April","May","June","July","August","September","October","November","December"]

//     const can = [lg.fortune.canh,lg.fortune.tan,lg.fortune.nham,lg.fortune.quy,lg.fortune.giap,lg.fortune.at,lg.fortune.binh,lg.fortune.dinh,lg.fortune.mau,lg.fortune.ky]

//     const chi = [lg.fortune.than,lg.fortune.dau,lg.fortune.tuat,lg.fortune.hoi,lg.fortune.ti,lg.fortune.suu,lg.fortune.dan,lg.fortune.mao,lg.fortune.thin,lg.fortune.ty,lg.fortune.ngo,lg.fortune.vi]

//     const rootDate = moment('06/07/2022','DD/MM/YYYY',true)

//     const dayBetween = rootDate.isBefore(mmt) ? mmt.diff(rootDate,'days')%60 : (60 - rootDate.diff(mmt,'days')%60)%60

//     const lunarlongyear = can[lunar.year%10] + " " + chi[lunar.year%12]
//     const lunarlongday = can[dayBetween%10] + " " + chi[dayBetween%12]
//     const lunarlongmonth = can[(((lunar.year%5-1)*2+10)%10+lunar.month-1)%10] + " " + chi[(lunar.month+5)%12]

//     if(lang === 'vi_VN') {
//         embed.setDescription(`Âm lịch: **Ngày ${lunarlongday} tháng ${lunarlongmonth} năm ${lunarlongyear} (${lunar.day}/${lunar.month}/${lunar.year})**\nDương lịch: **Ngày ${ngay} tháng ${thang} năm ${nam}**`)
//     } else if(lang === 'en_US') {
//         embed.setDescription(`Gregorian Calendar: **${month[thang]} ${ngay}, ${nam}**\nLunar Calendar: **${lunarlongday} day, ${lunarlongmonth} month, ${lunarlongyear} year (${month[lunar.month]} ${lunar.day}, ${lunar.year})**`)
//     }
    

//     await bot.wheatEmbedSend(message,[embed])
// }

// module.exports.run = run

// module.exports.help = help