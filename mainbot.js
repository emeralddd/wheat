require('events').EventEmitter.prototype._maxListeners = Infinity
require('events').defaultMaxListeners = Infinity
const { Collection, Client, GatewayIntentBits, ActivityType, Events } = require('discord.js')
const databaseManager = require('./modules/databaseManager')
const bot = require('wheat-better-cmd')
require('dotenv').config({path: 'secret.env'})
const announcement = require('./announcement.json')

const wheat = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent]})

let commandsList = new Collection()
let aliasesList = new Collection()
let helpMenu=[]
let groupMenu = {}
let language = []
let all = []
let groups = []
const langList = ['vi_VN','en_US']

const importLanguage = require('./modules/importLanguage')
const addCommands = require('./modules/addCommands')
const connectDatabase = require('./modules/connectDatabase')

let isInitial = false

const initial = async () => {
    if(isInitial) return
    try {
        ({groupMenu,helpMenu,aliasesList,commandsList,all,groups} = await addCommands(langList))
        language = importLanguage(langList)
        await connectDatabase()
        isInitial=true
    } catch (error) {
        console.log(error)
    }
}

wheat.once('ready', async () => {
    await initial()
    wheat.user.setPresence({
        activities:[{
            name: 'EHELP',
            type: ActivityType.Listening
        }],
        status:'online'
    })
    console.log(`[${wheat.shard.ids[0]}] Da dang nhap duoi ten ${wheat.user.tag}!`)
})

wheat.on('guildCreate', async (guild) => {
    const ownerId = await guild.fetchOwner()
    const embed = bot.wheatSampleEmbedGenerate()
    embed.setTitle(`Cảm ơn bạn vì đã sử dụng bot Wheat!`)
    embed.setDescription("Một số thứ dưới đây sẽ giúp bạn làm quen với bot:\n\n- Prefix mặc định của bot là `e`. Bạn có thể thay đổi bằng lệnh `eprefix`.\n\n- Ping bot để xem prefix hiện tại của bot.\n\n- Sử dụng lệnh `ehelp` để xem danh sách lệnh của bot.\n\n- Nếu còn điều gì thắc mắc, hãy sử dụng lệnh `esupport`.\n\n**Chúng tôi mong bạn sẽ có những trải nghiệm tốt nhất với Wheat!**")

    const embed1 = bot.wheatSampleEmbedGenerate()
    embed1.setTitle(`Thanks for using Wheat bot!`)
    embed1.setDescription("There are somethings can help you get started with bot:\n\n- Default prefix of bot is `e`. You can change it using `eprefix`.\n\n- Ping bot to see prefix of bot at specific server.\n\n- Using `ehelp` to see commands lists of bot.\n\n- If you has any questions, please use command `esupport`.\n\n**Hope you have the best experiences with Wheat!**")
    
    try {
        await ownerId.send({embeds:[embed,embed1]})
        await ownerId.send("🌾**Server Support:** https://discord.gg/z5Z4uzmED9")
    } catch(err) {}
})

wheat.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return

    if(process.env.NODE_ENV === 'dev' || process.env.ADMIN==='true') {
        const allowUsers=['687301490238554160','735665530500808755']
        if(!allowUsers.includes(interaction.member.id)) return
    }

    const memberId = interaction.user.id
    const guildId = interaction.guildId
    const channelId = interaction.channelId

    try {
        let prefix=process.env.PREFIX
        let lang=process.env.CODE

        const serverInfo = databaseManager.getServer(guildId)
    
        if(serverInfo) {
            prefix = serverInfo.prefix || prefix
            lang = serverInfo.language || lang
        } else {
            prefix = process.env.PREFIX
        }

        const memberInfo = databaseManager.getMember(memberId)

        if(memberInfo) {
            lang = memberInfo.language || lang
        }

        const lg = language[lang]

        const executeCommand = interaction.commandName

        interaction.language=lang

        if (commandsList.has(executeCommand)) {
            const command = commandsList.get(executeCommand)

            if(serverInfo && serverInfo.disable && serverInfo.disable.get(executeCommand) && serverInfo.disable.get(executeCommand).includes(channelId)) {
                await interaction.reply({ 
                    content: `Lệnh ${executeCommand} không được sử dụng tại kênh này!`, 
                    ephemeral: true 
                })
                return
            }

            try {
                await command.run({
                    wheat,
                    interaction,
                    helpMenu,
                    groupMenu,
                    prefix,
                    commandsList,
                    aliasesList,
                    language,
                    lang,
                    lg,
                    langList,
                    all,
                    groups
                })
            } catch (error) {
                console.log(error)
            } 
        }
    } catch(error) {
        console.log(error)
    }
})

wheat.on('messageCreate', async (message) => {
    if(message.channel.type === "dm") return
    
    if(process.env.NODE_ENV === 'dev' || process.env.ADMIN==='true') {
        const allowUsers=['687301490238554160','735665530500808755']
        if(!allowUsers.includes(message.author.id)) return
    }

    const msg = message.content
    const memberId = message.author.id
    const guildId = message.guild.id
    const channelId = message.channel.id

    try {
        if(!msg) return
        
        let prefix=process.env.PREFIX
        let lang=process.env.CODE

        const serverInfo = databaseManager.getServer(guildId)
    
        if(serverInfo) {
            prefix = serverInfo.prefix || prefix
            lang = serverInfo.language || lang
        } else {
            prefix = process.env.PREFIX
        }

        const memberInfo = databaseManager.getMember(memberId)

        if(memberInfo) {
            lang = memberInfo.language || lang
        }

        const lg = language[lang]
        
        if(msg==='<@786234973308715008>') {
            await bot.wheatSend(message,`${language[lang].main.myPrefix}: **${prefix}**`)
            return
        }

        if(!msg.toLowerCase().startsWith(prefix.toLowerCase())) return

        const S = msg.substring(prefix.length).split(' ')
        let args = []

        for(const i of S) {
            if(i !== '') args.push(i)
        }

        if(args.length===0) return

        const cmd = args[0].toLowerCase()
        let executeCommand = cmd
        if(aliasesList.has(executeCommand)) {
            executeCommand = aliasesList.get(executeCommand)
        }

        message.language=lang

        if (commandsList.has(executeCommand)) {
            const command = commandsList.get(executeCommand)

            if(serverInfo && serverInfo.disable && serverInfo.disable.get(executeCommand) && serverInfo.disable.get(executeCommand).includes(channelId)) return

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
                    commandsList,
                    aliasesList,
                    language,
                    lang,
                    cmd,
                    lg,
                    langList,
                    all,
                    groups
                })
                
                if(announcement.status==='active' && !announcement.ignoredcommand.includes(executeCommand) && !announcement.ignoredparents.includes(helpMenu[executeCommand].group)) {
                    const embed = bot.wheatSampleEmbedGenerate()
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

wheat.login((process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test' ? process.env.TOKEN : process.env.TOKEN2))
