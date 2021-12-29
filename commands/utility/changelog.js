const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')

const help = {
    name:"changelog",
    htu:" [lists/tên_bản_cập_nhật]",
    des:"Xem lịch sử sửa đổi của bot!",
    group:"utility",
    aliases: ["lichsucapnhat","lscn","cl"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String[]} obj.args
 */

const run = async ({message,args}) => {
    const overview = require('../../logs/overview.json').logs  
    const embed = await bot.wheatSampleEmbedGenerate(true)
    let logChosen
    if(args[1]) {
        if(args[1] === 'lists') {
            embed.setTitle(`Danh sách lịch sử bản cập nhật`)
            
            let details = ""
            overview.reverse().forEach(value => {
                details+="(#) `"+value+"`\n"
            })
            
            embed.setDescription(`Bản cập nhật mới nhất: **${overview[overview.length-1]}**`)
            embed.addField(`▼`,details)
            await bot.wheatEmbedSend(message,[embed])
            return
        }
        if(!overview.includes(args[1])) {
            await bot.wheatSend(message,`Không có bản cập nhật đó!`)
            return 
        }
        logChosen=args[1]
    }

    if(!logChosen) logChosen = overview[overview.length-1]

    const logJSON = require(`../../logs/${logChosen}.json`)

    embed.setTitle(`Lịch sử cập nhật`)
    embed.setDescription(`Bản cập nhật: ${logChosen}\nBản cập nhật trước đó: ${logJSON.before}`)

    let add = ``, remove =``
    logJSON.add.forEach(value => {
        add+=`(+) ${value}\n`
    })

    logJSON.remove.forEach(value => {
        remove+=`(-) ${value}\n`
    })

    embed.addFields([
        {
            name:`Thêm`,
            value: (add===``?`Không có`:add)
        },
        {
            name:`Xóa bỏ`,
            value: (remove===``?`Không có`:remove)
        }
    ])

    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help