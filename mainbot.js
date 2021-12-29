require('events').EventEmitter.prototype._maxListeners = Infinity
require('events').defaultMaxListeners = Infinity
const { Collection, Client, Intents } = require('discord.js')
const fs = require('fs')
const servers = require('./models/server')
const mongo = require('mongoose')
require('dotenv').config()

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
    const all = ["admin","utility","setting","ftelling","fun","random"]
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

wheat.on('messageCreate', async (message) => {
    if(message.channel.type === "dm") return
    
    if(process.env.NODE_ENV === 'dev') {
        if(message.author.id !== '687301490238554160') return
    }
    
    try {
        const msg= message.content
        if(!msg) return
        
        let prefix='-'

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

        if(!msg.toLowerCase().startsWith(prefix)) return

        const S = msg.substr(prefix.length).split(' ')
        let args = []

        for (const i of S) {
            if(i != '') args.push(i)
        }

        if(args.length===0) return

        let cmd = args[0].toLowerCase()

        if(aliasesList.has(cmd)) {
            cmd=aliasesList.get(cmd)
        }

        if (commandsList.has(cmd)) {
            const command = commandsList.get(cmd)
            try {
                command.run({
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
                    lang
                })
            } catch (error) {
                console.log(error)
            }
        }
    } catch(error) {
        console.log(error)
    }
})

wheat.login(process.env.TOKEN)
