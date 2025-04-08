const { SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const axios = require('axios').default;
require('dotenv').config({ path: 'secret.env' });
const moment = require('moment');
const { Request } = require('../../structure/Request');
const { convertTo2DigitNumber } = require('../../modules/dateParse');

const help = {
    name: "apod",
    group: "astronomy",
    aliases: ['astropic', 'nasapic', 'picday'],
    rate: 3000,
    data: new SlashCommandBuilder()
        .addIntegerOption(option =>
            option.setName('day')
                .setDescription('day')
                .setDescriptionLocalization('vi', "ngày")
                .setMinValue(1)
                .setMaxValue(31)
        )
        .addIntegerOption(option =>
            option.setName('month')
                .setDescription('month')
                .setDescriptionLocalization('vi', "tháng")
                .setMinValue(1)
                .setMaxValue(12)
        )
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('year')
                .setDescriptionLocalization('vi', "năm")
                .setMinValue(1970)
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 */

const run = async ({ request, args, t }) => {
    const [extractDay, extractMonth, extractYear] = dateInput(request, args ? args[1] : "", '/', ['day', 'month', 'year']);

    let mmt = null;

    if ((request.isMessage && args.length === 1) || (request.isInteraction && (!extractDay || !extractMonth || !extractYear))) {
        mmt = moment().subtract(1, 'days');
    } else {
        mmt = moment(`${convertTo2DigitNumber(extractDay)}/${convertTo2DigitNumber(extractMonth)}/${convertTo2DigitNumber(extractYear)}`, 'DD/MM/YYYY', true);
        if (!mmt.isValid()) {
            await request.reply(t('error.formatError'));
            return;
        }

        if (mmt.isBefore('1995-06-16')) {
            await request.reply(t('error.dateAfterApod'));
            return;
        }

        if (mmt.isAfter(moment().subtract(1, 'days'))) {
            await request.reply(t('error.dateOverApod'));
            return;
        }
    }

    const dateNasaFormat = mmt.format('YYYY-MM-DD');

    const key = [process.env.NASA_KEY1, process.env.NASA_KEY2, process.env.NASA_KEY3];

    axios.get(`https://api.nasa.gov/planetary/apod?api_key=${bot.wheatRandomElementFromArray(key)}&date=${dateNasaFormat}`, {
        timeout: 5000
    }).then(res => {
        if (!res.data.title) {
            return request.reply(t('error.undefinedError'));
        }

        const embed = bot.wheatSampleEmbedGenerate();

        embed.setTitle(res.data.title);
        embed.setFooter({ text: `${t('main.copyright')}: ${res.data.copyright || "NASA"}` });
        embed.setTimestamp(mmt.toDate());
        embed.setImage(res.data.url);
        embed.setDescription(res.data.explanation);

        request.reply({ embeds: [embed] });
    }).catch(error => {
        if (error.code === 'ECONNABORTED') {
            request.reply(t('error.nasaApodTakeTooLong'));
        } else {
            request.reply(t('error.undefinedError'));
        }
    });
}

module.exports.run = run;

module.exports.help = help;