const bot = require('wheat-better-cmd');
const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment');
const { Request } = require('../../structure/Request');
const { dateInput, convertTo2DigitNumber } = require('../../modules/dateParse');

const help = {
    name: "rtime",
    group: "random",
    aliases: ["randomtime", "ngaunhiengio", "timebetween"],
    data: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName('default')
                .setDescription('random from 00:00 to 23:59 inclusive')
                .setDescriptionLocalization('vi', 'ngẫu nhiên từ 00:00 đến 23:59')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('1option')
                .setDescription('random from 00:00 to time chosen')
                .setDescriptionLocalization('vi', 'ngẫu nhiên từ 00:00 đến thời điểm được nhập')
                .addIntegerOption(option =>
                    option.setName('hour')
                        .setDescription('hour')
                        .setDescriptionLocalization('vi', "giờ")
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(23)
                )
                .addIntegerOption(option =>
                    option.setName('minute')
                        .setDescription('minute')
                        .setDescriptionLocalization('vi', "phút")
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(59)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('2options')
                .setDescription('random from first time to last time')
                .setDescriptionLocalization('vi', 'ngẫu nhiên giữa hai thời điểm được nhập')
                .addIntegerOption(option =>
                    option.setName('shour')
                        .setDescription('start hour')
                        .setDescriptionLocalization('vi', "giờ bắt đầu")
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(23)
                )
                .addIntegerOption(option =>
                    option.setName('sminute')
                        .setDescription('start minute')
                        .setDescriptionLocalization('vi', "phút bắt đầu")
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(59)
                )
                .addIntegerOption(option =>
                    option.setName('lhour')
                        .setDescription('last hour')
                        .setDescriptionLocalization('vi', "giờ kết thúc")
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(23)
                )
                .addIntegerOption(option =>
                    option.setName('lminute')
                        .setDescription('last minute')
                        .setDescriptionLocalization('vi', "phút kết thúc")
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(59)
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
        const [hour, minute] = dateInput(request, args ? args[1] : "", ':', ['hour', 'minute']);
        first = moment(`00:00 26/03/2025`, 'HH:mm DD/MM/YYYY', true).unix();
        last = moment(`${convertTo2DigitNumber(hour)}:${convertTo2DigitNumber(minute)} 26/03/2025`, 'HH:mm DD/MM/YYYY', true).unix();
    } else if ((request.isMessage && args.length === 3) || subcommand === '2options') {
        const [shour, sminute] = dateInput(request, args ? args[1] : "", ':', ['shour', 'sminute']);
        const [lhour, lminute] = dateInput(request, args ? args[2] : "", ':', ['lhour', 'lminute']);
        first = moment(`${convertTo2DigitNumber(shour)}:${convertTo2DigitNumber(sminute)} 26/03/2025`, 'HH:mm DD/MM/YYYY', true).unix();
        last = moment(`${convertTo2DigitNumber(lhour)}:${convertTo2DigitNumber(lminute)} 26/03/2025`, 'HH:mm DD/MM/YYYY', true).unix();
    } else {
        await request.reply(t('error.formatError'));
        return;
    }

    if ((!first && first != 0) || (!last && last != 0)) {
        await request.reply(t('error.formatError'));
        return;
    }

    if (first > last) {
        await request.reply(t('error.startMustBeBeforeEnd'));
        return;
    }

    const choose = bot.wheatRandomNumberBetween(first, last);
    await request.reply(t('random.randomTime', { time: moment.unix(choose).format("HH:mm") }));
}

module.exports.run = run;

module.exports.help = help;