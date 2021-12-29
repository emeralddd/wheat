const { Message, Collection } = require('discord.js')
const bot = require('wheat-better-cmd')

const help = {
    name:"help",
    htu:" [lệnh || nhóm lệnh]",
    des:"Hiển thị danh sách nhóm lệnh, lệnh và cung cấp thông tin từng lệnh.",
    group:"utility",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {String[]} obj.args
 * @param {Array} obj.helpMenu
 * @param {Array} obj.groupMenu
 * @param {string} obj.prefix
 * @param {Collection} obj.aliasesList
 */

const run = async ({message,args,helpMenu,groupMenu,prefix,aliasesList}) => {
    const embed = await bot.wheatSampleEmbedGenerate(true)
    embed.setAuthor(`Wheat#1261`,process.env.AVATAR)

    if(args.length===1) {
        embed.setTitle(`Danh sách nhóm lệnh`) 
        embed.addFields(
            { 
                name: 'Bói toán', 
                value: '`'+prefix+'help ftelling`'
            },
            { 
                name: 'Fun', 
                value: '`'+prefix+'help fun`', 
            },
            { 
                name: 'Random', 
                value: '`'+prefix+'help random`', 
            },
            { 
                name: 'Bổ trợ', 
                value: '`'+prefix+'help utility`',
            },
            { 
                name: 'Cài đặt', 
                value: '`'+prefix+'help setting`',
            },
            {
                name: 'Hỗ trợ',
                value: 'Tham gia Server Hỗ Trợ: https://discord.gg/z5Z4uzmED9',
            }
        )
        await bot.wheatEmbedSend(message,[embed])
    } else {
        let list="",command
        command = args[1].toLowerCase()

        if(groupMenu[command]) {
            for(const id of groupMenu[command]) {
                list+=" `" + id + "`"
            }
            embed.setTitle(`Nhóm lệnh: ${command}`)
            embed.setDescription(list)
            await bot.wheatEmbedSend(message,[embed])
        } else {
            if (aliasesList.has(command)) command = aliasesList.get(command)
            
            if(helpMenu[command]) {
                for(const id of helpMenu[command].aliases) {
                    list+= " `" + id + "`"
                }
                
                if(list==="") list = 'Không có'
                embed.setTitle(`Lệnh: ${command}`)
                embed.addFields(
                    {
                        name: `Nhóm lệnh cha`,
                        value: "`"+helpMenu[command].group+"`",
                    },
                    {
                        name: `Tên gọi khác`,
                        value: list,
                    },
                    {
                        name: `Cú pháp`,
                        value: "`" + prefix +command+helpMenu[command].htu + "`", 
                    }
                )
                
                embed.setDescription(helpMenu[command].des);
                embed.setFooter(`Lưu ý: [] - tùy chọn; <> - bắt buộc`)
                    
                await bot.wheatEmbedSend(message,[embed])
            } else {
                await bot.wheatSend(message,`Không có lệnh hoặc nhóm lệnh đó!`)
            }
        }
    }
}

module.exports.run = run

module.exports.help = help