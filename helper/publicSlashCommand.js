const { REST, Routes } = require('discord.js');
require('dotenv').config({ path: 'secret.env' })
const { SlashCommandBuilder } = require('discord.js');
const langList = ['vi', 'en']
const bot = require('wheat-better-cmd')
const { readdirSync } = require("fs")

const commands = []

const clientId2 = '860599818103422978'
const clientId = '786234973308715008'
const guildId = '747714988503859221'

const groups = ["astronomy", "ftelling", "random", "fun", "utility", "setting"]

const LANG = []

const get = async () => {
    for (const l of langList) {
        const descriptionOfCommands = await bot.wheatReadJSON(`./assets/language/${l}/descriptionOfCommands.json`)

        for (const g of groups) {
            if (!descriptionOfCommands[g]) continue
            for (const c of descriptionOfCommands[g]) {
                LANG[c.name] = {}
                LANG[c.name].desc = []
            }
        }
    }

    for (const l of langList) {
        const descriptionOfCommands = await bot.wheatReadJSON(`./assets/language/${l}/descriptionOfCommands.json`)

        for (const g of groups) {
            if (!descriptionOfCommands[g]) continue
            for (const c of descriptionOfCommands[g]) {
                LANG[c.name].desc[l] = c.desc
            }
        }
    }

    for (const str of groups) {
        const files = readdirSync(`./commands/${str}`)
        const jsfile = files.filter(file => file.split('.').pop() === 'js')

        if (jsfile.length === 0) {
            console.error('Chua lenh nao duoc add!')
        }

        for (const file of jsfile) {
            const module = require(`../commands/${str}/${file}`)

            if (module.help && module.help.name !== 'test') {

                if (process.env.NODE_ENV === 'dev' || module.help.status !== 'dev') {

                    if (!LANG[module.help.name]) continue;

                    const slashcommand = module.help.data || new SlashCommandBuilder()

                    slashcommand.setName(module.help.name)

                    slashcommand.setDescription(LANG[module.help.name].desc['en'])
                    slashcommand.setDescriptionLocalizations({
                        "vi": LANG[module.help.name].desc['vi']
                    })

                    commands.push(slashcommand.toJSON())
                }
            }
        }
    }
}

get().then(async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN2)
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})

