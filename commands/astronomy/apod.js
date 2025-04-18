const { SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const axios = require('axios').default;
require('dotenv').config({ path: 'secret.env' });
const moment = require('moment');
const { Request } = require('../../structure/Request');
const { convertTo2DigitNumber, dateInput } = require('../../modules/dateParse');

const help = {
    name: "apod",
    group: "astronomy",
    aliases: ['astropic', 'nasapic', 'picday'],
    example: [' 1/1/2012'],
    rate: 3000,
    data: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName('yesterday')
                .setDescription('View an astronomical image of yesterday in a day provided by NASA')
                .setDescriptionLocalization('vi', "Xem bức ảnh thiên văn của ngày hôm qua cung cấp bởi NASA")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('anotherday')
                .setDescription('View an astronomical image of any given in a day provided by NASA')
                .setDescriptionLocalization('vi', "Xem một bức ảnh thiên văn của một ngày bất kì cung cấp bởi NASA")
                .addIntegerOption(option =>
                    option.setName('day')
                        .setDescription('day')
                        .setDescriptionLocalization('vi', "ngày")
                        .setMinValue(1)
                        .setMaxValue(31)
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('month')
                        .setDescription('month')
                        .setDescriptionLocalization('vi', "tháng")
                        .setMinValue(1)
                        .setMaxValue(12)
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('year')
                        .setDescription('year')
                        .setDescriptionLocalization('vi', "năm")
                        .setMinValue(1995)
                        .setRequired(true)
                )
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 */

const run = async ({ request, args, t }) => {
    let mmt = moment().subtract(1, 'days');

    mmt.set('hour', 0);
    mmt.set('minute', 0);

    if (!(request.isMessage && args.length === 1) && !(request.isInteraction && request.interaction.options.getSubcommand(false) === 'yesterday')) {
        const [extractDay, extractMonth, extractYear] = dateInput(request, args ? args[1] : "", '/', ['day', 'month', 'year']);

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