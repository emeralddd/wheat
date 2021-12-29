const bot = require('wheat-better-cmd')
const {MessageAttachment, Message} = require('discord.js')
const moment = require('moment')

const help = {
    name:"hoangdao",
    htu:" <ngày ở định dạng DD/MM>",
    des:"Xem cung hoàng đạo Phương Tây cho ngày sinh và thông tin về cung đó, không tin tưởng tất cả!",
    group:"ftelling",
    aliases: ["zodiac"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

const run = async ({message,args}) => {
    const embed = await bot.wheatSampleEmbedGenerate()
    const date = args[1]

    const mmt =moment(date,'DD/MM',true)
    if(!mmt.isValid()&&date!=='29/02') {
        await bot.wheatSendErrorMessage(message,`Sai cấu trúc ngày!`)
        return
    }

    const zodiac = await bot.wheatReadJSON('./storage/hoangdaophuongtay.json')

    let str_time = []
    let end_time = []
    const compareDate = moment(date, "DD/MM")
    str_time[0] = moment("20/03", "DD/MM")
    str_time[1] = moment("19/04", "DD/MM")
    str_time[2] = moment("20/05", "DD/MM")
    str_time[3] = moment("21/06", "DD/MM")
    str_time[4] = moment("22/07", "DD/MM")
    str_time[5] = moment("22/08", "DD/MM")
    str_time[6] = moment("22/09", "DD/MM")
    str_time[7] = moment("22/10", "DD/MM")
    str_time[8] = moment("22/11", "DD/MM")
    str_time[9] = moment("21/12", "DD/MM")
    str_time[10] = moment("19/01", "DD/MM")
    str_time[11] = moment("18/02", "DD/MM")
    end_time[0] = moment("20/04", "DD/MM")
    end_time[1] = moment("21/05", "DD/MM")
    end_time[2] = moment("22/06", "DD/MM")
    end_time[3] = moment("23/07", "DD/MM")
    end_time[4] = moment("23/08", "DD/MM")
    end_time[5] = moment("23/09", "DD/MM")
    end_time[6] = moment("23/10", "DD/MM")
    end_time[7] = moment("23/11", "DD/MM")
    end_time[8] = moment("22/12", "DD/MM")
    end_time[9] = moment("20/01", "DD/MM")
    end_time[10] = moment("19/02", "DD/MM")
    end_time[11] = moment("21/03", "DD/MM")
        
    let i
    for(i=0; i<=11; i++) {
        if(compareDate.isBetween(str_time[i],end_time[i])) {
            break
        }
    }
    
    if(date==='29/02') i=11
    if(i===12) i=9

    const tinhchat=["Vận Động","Cố Định","Biến đổi"]
    const tukhoatc=["Hành động, năng động, chủ động, tác động lớn","Chống lại sự thay đổi, sức mạnh ý chí lớn, không linh hoạt","Khả năng thích ứng, linh hoạt, tháo vát"]
    const nguyento=["Lửa","Đất","Khí","Nước"]
    const tukhoangto=["Nhiệt tình, nỗ lực thể hiện bản thân, niềm tin","Giao tiếp, xã hội hóa, khái niệm hóa","Thực tiễn, thận trọng, thế giới vật chất","Cảm xúc, đồng cảm, nhạy cảm"]

    embed.setAuthor('⋗ Cung hoàng đạo thứ: ' + String(i+1))
    embed.setTitle(zodiac[i].unicode+" "+zodiac[i].name)
    embed.setFooter(`Tham gia Server Hỗ Trợ: https://discord.gg/z5Z4uzmED9`)
    embed.addFields(
        {
            name:"∴ Đặc điểm",
            value:`⋄ Biểu tượng: ${zodiac[i].gloss}\n⋄ Kinh độ Hoàng đạo: ${i*30}° đến ${(i+1)*30}°\n⋄ Thời gian: ${zodiac[i].start} đến ${zodiac[i].end}\n⋄ Đối lập với: ${zodiac[i].doilap}`
        },
        {
            name:"∴ Tính chất",
            value:`⋯ Tính chất: ${tinhchat[i%3]}\n⋯ Từ khóa: ${tukhoatc[i%3]}`
        },
        {
            name:"∴ Nguyên tố",
            value:`⋯ Thuộc nguyên tố: ${nguyento[i%4]}\n⋯ Từ khóa: ${tukhoangto[i%4]}`
        },
        {
            name:"∴ Thiên thể Cai trị",
            value:`⋇ Cổ điển: ${zodiac[i].sao_cd}\n⋇ Hiện đại: ${zodiac[i].sao_hd}`
        },
        {
            name:"∴ Phẩm giá Bản chất",
            value:`≫ Phẩm giá: ${zodiac[i].phamgia}\n≫ Bất lợi: ${zodiac[i].batloi}\n≫ Đắc địa: ${zodiac[i].dacdia}\n≫ Suy thoái: ${zodiac[i].suythoai}`
        }
    )

    const fileimage = String(i+1) + '.png'
	const attachment = new MessageAttachment('./storage/zodiac_image/' + fileimage,fileimage)
    embed.setThumbnail('attachment://'+ fileimage)

    await bot.wheatEmbedAttachFilesSend(message,[embed],[attachment])
}

module.exports.run = run

module.exports.help = help