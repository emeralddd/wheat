const { SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const axios = require('axios').default;
require('dotenv').config({ path: 'secret.env' });
const moment = require('moment');
const { Request } = require('../../structure/Request');

const help = {
    name: "apod",
    group: "astronomy",
    aliases: ['astropic', 'nasapic', 'picday'],
    rate: 3000,
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('date')
                .setDescription('<DD/MM/YYYY>')
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 */

const run = async ({ request, args, lg }) => {
    const date = (request.isMessage ? args[1] : request.interaction.options.getString('date')) || moment().subtract(1, 'days').format('DD/MM/YYYY');

    const mmt = moment(date, 'DD/MM/YYYY', true);
    if (!mmt.isValid()) {
        await request.reply(lg.error.formatError);
        return;
    }

    if (mmt.isBefore('1995-06-16')) {
        await request.reply(lg.error.dateAfterApod);
        return;
    }

    if (mmt.isAfter(moment().subtract(1, 'days'))) {
        await request.reply(lg.error.dateOverApod);
        return;
    }

    const date_str = mmt.format('YYYY-MM-DD');

    const key = [process.env.NASA_KEY1, process.env.NASA_KEY2, process.env.NASA_KEY3];

    axios.get(`https://api.nasa.gov/planetary/apod?api_key=${bot.wheatRandomElementFromArray(key)}&date=${date_str}`, {
        timeout: 5000
    }).then(res => {
        // console.log(res.data);
        if (!res.data.title) {
            request.reply(lg.error.undefinedError);
            return;
        }

        const embed = bot.wheatSampleEmbedGenerate();

        embed.setTitle(res.data.title);
        embed.setFooter({ text: `${lg.main.copyright}: ${res.data.copyright || "NASA"}` });
        embed.setTimestamp(mmt.toDate());
        embed.setImage(res.data.url);
        embed.setDescription(res.data.explanation);

        request.reply({ embeds: [embed] });
    }).catch(error => {
        // console.log(err);
        if (error.code === 'ECONNABORTED') {
            request.reply(lg.error.nasaApodTakeTooLong);
        } else {
            request.reply(lg.error.undefinedError);
        }
    });
}

module.exports.run = run;

module.exports.help = help;