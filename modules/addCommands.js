const bot = require('wheat-better-cmd')
const rateLimiter = require('./rateLimiter');
const { Collection } = require("discord.js")
const { readdirSync } = require("fs")

module.exports = async (langList) => {
    let commandsList = new Collection()
    let aliasesList = new Collection()
    let helpMenu=[]
    let groupMenu = {}

    const all = ["admin","astronomy","ftelling","random","fun","utility","setting"]
    const groups = ["astronomy","ftelling","random","fun","utility","setting"]

    for(const str of all) {
        const files = readdirSync(`./commands/${str}`)
        const jsfile = files.filter(file => file.split('.').pop() === 'js')

        if(jsfile.length === 0) {
            console.error('Chua lenh nao duoc add!')
        }

        for(const file of jsfile) {
            const module = require(`../commands/${str}/${file}`)

            if(module.help) {

                if(process.env.NODE_ENV === 'dev' || module.help.status !== 'dev') {

                    commandsList.set(module.help.name,module)
                    helpMenu[file.split('.js')[0]] = module.help

                    helpMenu[module.help.name].syntax=[]
                    helpMenu[module.help.name].desc=[]
                    helpMenu[module.help.name].note=[]
                    
                    // console.log(file.split('.js')[0])
    
                    if(!groupMenu[str]) groupMenu[str]=[]
                    groupMenu[str].push(module.help.name)
                    
                    for(const alias of module.help.aliases) {
                        aliasesList.set(alias,module.help.name)
                    }
                }
            }
        }
    }

    // console.log('abc')

    for(const l of langList) {
        const descriptionOfCommands = await bot.wheatReadJSON(`./assets/language/${l}/descriptionOfCommands.json`)
        
        for(const g of all) {
            // console.log(g)
            if(!descriptionOfCommands[g]) continue
            for(const c of descriptionOfCommands[g]) {
                helpMenu[c.name].syntax[l]=c.syntax
                helpMenu[c.name].desc[l]=c.desc
                helpMenu[c.name].note[l]=c.note
            }
        }
    }

    // console.log(helpMenu['tarot'])

    rateLimiter.init(helpMenu);

    return {groupMenu,helpMenu,aliasesList,commandsList,all,groups}
}