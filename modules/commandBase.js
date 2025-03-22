const rateLimiter = require('./rateLimiter');
const { Collection } = require("discord.js");
const { readdirSync } = require("fs");

const commandsList = new Collection();
const aliasesList = new Collection();
const groupMenu = {};
const groupList = ["astronomy", "ftelling", "random", "fun", "utility", "setting", "admin"];

const { languageList, descriptionOfCommands } = require('./languageBase');

const initiate = async () => {
    const rateObj = {};
    for (const group of groupList) {
        const files = readdirSync(`./commands/${group}`);
        const jsfile = files.filter(file => file.split('.').pop() === 'js');

        if (jsfile.length === 0) {
            console.error('Chua lenh nao duoc add!');
        }

        for (const file of jsfile) {
            const command = require(`../commands/${group}/${file}`);

            if (command.help && (process.env.NODE_ENV === 'dev' || command.help.status !== 'dev')) {
                const commandName = command.help.name;
                command.help.group = group;

                if (!groupMenu[group]) groupMenu[group] = [];
                groupMenu[group].push(commandName);

                commandsList.set(commandName, command);

                rateObj[commandName] = command.help;

                for (const alias of command.help.aliases) {
                    aliasesList.set(alias, commandName);
                }
            }
        }
    }

    for (const lang of languageList) {
        for (const group of groupList) {
            if (!descriptionOfCommands[lang][group]) continue;
            for (const c of descriptionOfCommands[lang][group]) {
                const helpCommand = commandsList.get(c.name);

                if (!helpCommand.help.syntax) {
                    helpCommand.help.syntax = {};
                    helpCommand.help.desc = {};
                    helpCommand.help.note = {};
                }

                helpCommand.help.syntax[lang] = c.syntax;
                helpCommand.help.desc[lang] = c.desc;
                helpCommand.help.note[lang] = c.note;

                commandsList.set(c.name, helpCommand);
            }
        }
    }

    rateLimiter.init(rateObj);
}

const commandGet = (command) => {
    return commandsList.get(command);
}

const aliaseGet = (command) => {
    return aliasesList.get(command);
}

const commandHas = (command) => {
    return commandsList.has(command);
}

const aliaseHas = (command) => {
    return aliasesList.has(command);
}

module.exports = {
    get commandsList() {
        return commandsList;
    },
    get aliasesList() {
        return aliasesList;
    },
    get groupMenu() {
        return groupMenu;
    },
    get groupList() {
        return groupList;
    },
    commandGet,
    aliaseGet,
    commandHas,
    aliaseHas,
    initiate
}