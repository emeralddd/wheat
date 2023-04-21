const { Message, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const axios = require('axios').default;
require('dotenv').config({path: 'secret.env'});
const moment = require('moment');

const help = {
    name:"apod",
    group:"astronomy",
    aliases: ['astropic','nasapic','picday'],
    rate:3000,
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('date')
                .setDescription('<DD/MM/YYYY>')
        )
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 */

const run = async ({message,interaction,args,lg}) => {
    const date = (args?args[1]:interaction.options.getString('date')) || moment().subtract(1, 'days').format('DD/MM/YYYY');

    message = message || interaction
    
    const mmt = moment(date,'DD/MM/YYYY',true);
    if(!mmt.isValid()) {
        await bot.wheatSendErrorMessage(message,lg.error.formatError);
        return;
    }

    if(mmt.isBefore('1995-06-16')) {
        await bot.wheatSendErrorMessage(message,lg.error.dateAfterApod);
        return;
    }

    if(mmt.isAfter(moment().subtract(1,'days'))) {
        await bot.wheatSendErrorMessage(message,lg.error.dateOverApod)
        return
    }
    
    const date_str= mmt.format('YYYY-MM-DD')

    const key = [process.env.NASA_KEY1,process.env.NASA_KEY2,process.env.NASA_KEY3]

    const res = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${bot.wheatRandomElementFromArray(key)}&date=${date_str}`)

    if(!res.data.title) {
        await bot.wheatSendErrorMessage(message,lg.error.undefinedError)
        return
    }

    const embed = bot.wheatSampleEmbedGenerate()

    embed.setTitle(res.data.title)
    embed.setFooter({text:`${lg.main.copyright}: ${res.data.copyright || "NASA"}`})
    embed.setTimestamp(mmt.toDate())
    embed.setImage(res.data.url)
    embed.setDescription(res.data.explanation)

    await bot.wheatEmbedSend(message,[embed])
}

module.exports.run = run

module.exports.help = help