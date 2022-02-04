require('events').EventEmitter.prototype._maxListeners = Infinity
require('events').defaultMaxListeners = Infinity
const { Collection, Client, Intents } = require('discord.js')
const bot = require('wheat-better-cmd')
const fs = require('fs')
const servers = require('./models/server')
const mongo = require('mongoose')
require('dotenv').config()
const announcement = require('./announcement.json')

const wheat = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]})
let commandsList = new Collection()
let aliasesList = new Collection()
let helpMenu=[]
let groupMenu = {}
let language = []

language['vi_VN'] = require('./language/vi_VN.json')
language['en_US'] = require('./language/en_US.json')

const importLanguage = () => {
    const langList = ['vi_VN','en_US']
    langList.forEach(i => {
        language[i] = require(`./language/${i}.json`)
    })
}

const addCommand = () => {
    const all = ["admin","astronomy","utility","setting","ftelling","fun","random"]
    all.forEach(str => {
        fs.readdir(`./commands/${str}`, (error, files) => {
            if(error) {
                console.error(error.message)
            }
            const jsfile = files.filter(file => file.split('.').pop() === 'js')
            if(jsfile.length === 0) {
                console.error('Chua lenh nao duoc add!')
            }
            jsfile.forEach((file,index) => {
                const module = require(`./commands/${str}/${file}`)
    
                if(module.help) {

                    if(process.env.NODE_ENV === 'dev' || module.help.status !== 'dev') {
    
                        commandsList.set(module.help.name,module)
                        helpMenu[file.split('.js')[0]] = module.help

        
                        if(!groupMenu[str]) groupMenu[str]=[]
                        groupMenu[str].push(module.help.name)
        
                        module.help.aliases.forEach(alias => {
                            aliasesList.set(alias,module.help.name)
                        })

                    }
                }
            })
        })
    })
}

const connectDB = async () => {
    try {
        await mongo.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.mwdxl.mongodb.net/client?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('DB Connected Successfully!')
    } catch (err) {
        if(err) {
            console.log(err.message)
            process.exit(1)
        }
    }
}
let isInitial = false
const initial = async () => {
    if(isInitial) return
    try {
        importLanguage()
        addCommand()
        if(process.env.NODE_ENV !== 'dev') connectDB()
        isInitial=true
    } catch (error) {
        console.error(error.message)
    }
}

initial()

wheat.once('ready', () => {

    wheat.user.setActivity('EHELP', {type:'LISTENING'});
    console.log(`Da dang nhap duoi ten ${wheat.user.tag}!`)
})

wheat.on('guildCreate',async (guild) => {
    const ownerId = await guild.fetchOwner()
    const embed = await bot.wheatSampleEmbedGenerate()
    embed.setTitle(`Cảm ơn bạn vì đã sử dụng bot Wheat!`)
    embed.setDescription("Một số thứ dưới đây sẽ giúp bạn làm quen với bot:\n\n- Prefix mặc định của bot là `e`. Bạn có thể thay đổi bằng lệnh `eprefix`.\n\n- Ping bot để xem prefix hiện tại của bot.\n\n- Sử dụng lệnh `ehelp` để xem danh sách lệnh của bot.\n\n- Nếu còn điều gì thắc mắc, hãy sử dụng lệnh `esupport`.\n\n**Chúng tôi mong bạn sẽ có những trải nghiệm tốt nhất với Wheat!**")

    const embed1 = await bot.wheatSampleEmbedGenerate()
    embed1.setTitle(`Thanks for using Wheat bot!`)
    embed1.setDescription("There are somethings can help you get started with bot:\n\n- Default prefix of bot is `e`. You can change it using `eprefix`.\n\n- Ping bot to see prefix of bot at specific server.\n\n- Using `ehelp` to see commands lists of bot.\n\n- If you has any questions, please use command `esupport`.\n\n**Hope you have the best experiences with Wheat!**")
    
    try {
        await ownerId.send({embeds:[embed,embed1]})
        await ownerId.send("🌾**Server Support:** https://discord.gg/z5Z4uzmED9")
    } catch(err) {}
})

wheat.on('messageCreate', async (message) => {
    if(message.channel.type === "dm") return
    
    if(process.env.NODE_ENV === 'dev') {
        const allowUsers=['687301490238554160','735665530500808755']
        if(!allowUsers.includes(message.author.id)) return
    }
    
    try {
        const msg= message.content
        if(!msg) return
        
        let prefix='='

        if(process.env.NODE_ENV !== 'dev') {
            const serverInfo = await servers.findOne({id:message.guild.id})
        
            if(serverInfo) {
                prefix = serverInfo.prefix || process.env.PREFIX
            } else {
                prefix = process.env.PREFIX
            }
        }

        const lang="vi_VN"

        if(msg==='<@!786234973308715008>') {
            message.channel.send(`${language[lang].my_prefix}: **${prefix}**`)
            return
        }

        if(!msg.toLowerCase().startsWith(prefix.toLowerCase())) return

        const S = msg.substr(prefix.length).split(' ')
        let args = []

        for (const i of S) {
            if(i != '') args.push(i)
        }

        if(args.length===0) return

        const cmd = args[0].toLowerCase()
        let executeCommand = cmd
        if(aliasesList.has(executeCommand)) {
            executeCommand=aliasesList.get(executeCommand)
        }

        if (commandsList.has(executeCommand)) {
            const command = commandsList.get(executeCommand)
            try {
                await command.run({
                    wheat,
                    S,
                    message,
                    msg,
                    args,
                    helpMenu,
                    groupMenu,
                    prefix,
                    aliasesList,
                    language,
                    lang,
                    cmd
                })
                
                if(announcement.status==='active' && !announcement.ignoredcommand.includes(executeCommand) && !announcement.ignoredparents.includes(helpMenu[executeCommand].group)) {
                    const embed = await bot.wheatSampleEmbedGenerate()
                    embed.setTitle(announcement.title)
                    embed.setDescription(announcement.description)
                    await bot.wheatEmbedSend(message,[embed])
                }
                
            } catch (error) {
                console.log(error)
            } 
        }
    } catch(error) {
        console.log(error)
    }
})

wheat.login((process.env.NODE_ENV === 'dev' ? process.env.TOKEN : process.env.TOKEN2))
