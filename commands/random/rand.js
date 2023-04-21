const { Message, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const bot = require('wheat-better-cmd')

const help = {
    name:"rand",
    group:"random",
    aliases: ["rd","ngaunhien","batky","rdm","r"],
    data: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName('default')
                .setDescription('random in [1,100]')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('1option')
                .setDescription('random in [1,max]')
                .addIntegerOption(option =>
                    option.setName('max')
                        .setDescription('integer > 1')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('2options')
                .setDescription('random in [min,max]')
                .addIntegerOption(option =>
                    option.setName('min')
                        .setDescription('integer > 1')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('max')
                        .setDescription('integer > 1')
                        .setRequired(true)
                )
        )
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 * @param {String[]} obj.args
 */

const run = async ({message,interaction,args,lg}) => {
    let numberMIN = 0
	let numberMAX = 0

    if(message) {
        numberMIN = Number(args[1])
        numberMAX = Number(args[2])
        
        if(!numberMIN&&numberMIN!=0) {
            numberMIN=1
            numberMAX=100
        }
        
        if(!numberMAX&&numberMAX!=0) {
            numberMAX=numberMIN
            numberMIN=1
        }
    
    } else {
        if(interaction.options.getSubcommand()==='default') {
            numberMIN=1
            numberMAX=100
        }

        if(interaction.options.getSubcommand()==='1option') {
            numberMIN=1
            numberMAX=interaction.options.getInteger('max')
        }

        if(interaction.options.getSubcommand()==='2options') {
            numberMIN=interaction.options.getInteger('min')
            numberMAX=interaction.options.getInteger('max')
        }
    }
    
    if(numberMIN>numberMAX) {
        const temp=numberMIN
        numberMIN=numberMAX
        numberMAX=temp
    }

    message ||= interaction

	const randomNumber = Math.floor(Math.random()*(numberMAX-numberMIN+1)+numberMIN)
	await bot.wheatSend(message,`${lg.random.randomNumInRange} [${numberMIN},${numberMAX}] ${lg.main.is}: ${randomNumber}`) 
}

module.exports.run = run

module.exports.help = help