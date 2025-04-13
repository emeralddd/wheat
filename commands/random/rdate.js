const bot = require('wheat-better-cmd');
const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment');
const { Request } = require('../../structure/Request');
const { convertTo2DigitNumber, dateInput } = require('../../modules/dateParse');

const help = {
    name: "rdate",
    group: "random",
    aliases: ["randomdate", "ngaunhienngay", "datebetween"],
    example: ["", " 1/12/2012", " 4/5/2020 12/6/2023"],
    data: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName('default')
                .setDescription('random from 01/01/1970 to today')
                .setDescriptionLocalization('vi', 'ngẫu nhiên từ ngày 01/01/1970 đến hôm nay')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('1option')
                .setDescription('random from 01/01/1970 to last date inclusive')
                .setDescriptionLocalization('vi', 'ngẫu nhiên từ 01/01/1970 đến ngày được nhập')
                .addIntegerOption(option =>
                    option.setName('day')
                        .setDescription('day')
                        .setDescriptionLocalization('vi', "ngày")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(31)
                )
                .addIntegerOption(option =>
                    option.setName('month')
                        .setDescription('month')
                        .setDescriptionLocalization('vi', "tháng")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(12)
                )
                .addIntegerOption(option =>
                    option.setName('year')
                        .setDescription('year')
                        .setDescriptionLocalization('vi', "năm")
                        .setRequired(true)
                        .setMinValue(1970)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('2options')
                .setDescription('random from first date to last date inclusive')
                .setDescriptionLocalization('vi', 'ngẫu nhiên giữa 2 ngày được nhập')
                .addIntegerOption(option =>
                    option.setName('sday')
                        .setDescription('start day')
                        .setDescriptionLocalization('vi', "ngày đầu")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(31)
                )
                .addIntegerOption(option =>
                    option.setName('smonth')
                        .setDescription('start month')
                        .setDescriptionLocalization('vi', "tháng đầu")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(12)
                )
                .addIntegerOption(option =>
                    option.setName('syear')
                        .setDescription('start year')
                        .setDescriptionLocalization('vi', "năm đầu")
                        .setRequired(true)
                        .setMinValue(1970)
                )
                .addIntegerOption(option =>
                    option.setName('lday')
                        .setDescription('last day')
                        .setDescriptionLocalization('vi', "ngày cuối")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(31)
                )
                .addIntegerOption(option =>
                    option.setName('lmonth')
                        .setDescription('last month')
                        .setDescriptionLocalization('vi', "tháng cuối")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(12)
                )
                .addIntegerOption(option =>
                    option.setName('lyear')
                        .setDescription('last year')
                        .setDescriptionLocalization('vi', "năm cuối")
                        .setRequired(true)
                        .setMinValue(1970)
                )
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, t }) => {
    let first, last;

    const subcommand = request.isInteraction ? request.interaction.options.getSubcommand(false) : "";

    if ((request.isMessage && args.length === 1) || subcommand === 'default') {
        first = 0;
        last = Date.now() / 1000;
    } else if ((request.isMessage && args.length === 2) || subcommand === '1option') {
        const [extractDay, extractMonth, extractYear] = dateInput(request, args ? args[1] : "", '/', ['day', 'month', 'year']);
        first = moment('01/01/1970', 'DD/MM/YYYY', true).unix();
        last = moment(`${convertTo2DigitNumber(extractDay)}/${convertTo2DigitNumber(extractMonth)}/${convertTo2DigitNumber(extractYear)}`, 'DD/MM/YYYY', true).unix();
    } else if ((request.isMessage && args.length === 3) || subcommand === '2options') {
        const [sday, smonth, syear] = dateInput(request, args ? args[1] : "", '/', ['sday', 'smonth', 'syear']);
        const [lday, lmonth, lyear] = dateInput(request, args ? args[2] : "", '/', ['lday', 'lmonth', 'lyear']);
        first = moment(`${convertTo2DigitNumber(sday)}/${convertTo2DigitNumber(smonth)}/${convertTo2DigitNumber(syear)}`, 'DD/MM/YYYY', true).unix();
        last = moment(`${convertTo2DigitNumber(lday)}/${convertTo2DigitNumber(lmonth)}/${convertTo2DigitNumber(lyear)}`, 'DD/MM/YYYY', true).unix();
    } else {
        await request.reply(t('error.formatError'));
        return;
    }

    if ((!first && first !== 0) || (!last && last !== 0)) {
        await request.reply(t('error.formatError'));
        return;
    }

    if (first > last) {
        await request.reply(t('error.startMustBeBeforeEnd'));
        return;
    }

    const choose = bot.wheatRandomNumberBetween(first, last);

    await request.reply(t('random.randomDate', { date: moment.unix(choose).format("DD/MM/YYYY") }));
}

module.exports.run = run;

module.exports.help = help;