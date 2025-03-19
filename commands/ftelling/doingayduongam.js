const { SlashCommandBuilder } = require('discord.js');
const { convertDuongAm, convertAmDuong } = require('../../modules/getLunarDate');
const bot = require('wheat-better-cmd');
const moment = require('moment');
const { Request } = require('../../structure/Request');

const convertTo2DigitNumber = (n) => {
    return (n < 10 ? "0" : "") + n;
}

const help = {
    name: "doingayduongam",
    group: "ftelling",
    example: [" a 25/11/2022", " d 1/1/2022"],
    aliases: ["duongam", "amduong", "doingayamduong"],
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type Lunar/Gregorian date')
                .setRequired(true)
                .setChoices(
                    { name: 'Âm lịch (Lunar)', value: 'a' },
                    { name: 'Dương lịch (Gregorian)', value: 'd' },
                )
        )
        .addIntegerOption(option =>
            option.setName('day')
                .setDescription('day')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(31)
        )
        .addIntegerOption(option =>
            option.setName('month')
                .setDescription('month')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(12)
        )
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('year')
                .setRequired(true)
                .setMinValue(1)
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
*/

const run = async ({ request, args, lg, lang }) => {
    const embed = bot.wheatSampleEmbedGenerate();
    const type = request.isMessage ? args[1] : request.interaction.options.getString('type');

    if (type !== 'd' && type !== 'a') {
        return request.reply('Missing a/d option.');
    }

    const dateInput = request.isMessage ? args[2].split('/') : null;

    const extractDay = request.isMessage ? Number(dateInput[0]) : request.interaction.options.getInteger('day');
    const extractMonth = request.isMessage ? Number(dateInput[1]) : request.interaction.options.getInteger('month');
    const extractYear = request.isMessage ? Number(dateInput[2]) : request.interaction.options.getInteger('year');

    if (type === 'd') {
        const mmt = moment(`${convertTo2DigitNumber(extractDay)}/${convertTo2DigitNumber(extractMonth)}/${convertTo2DigitNumber(extractYear)}`, 'DD/MM/YYYY', true);

        if (!mmt.isValid()) {
            await request.reply(lg.error.formatError);
            return;
        }

        const lunar = convertDuongAm(extractDay, extractMonth, extractYear);

        const month = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const can = [lg.fortune.canh, lg.fortune.tan, lg.fortune.nham, lg.fortune.quy, lg.fortune.giap, lg.fortune.at, lg.fortune.binh, lg.fortune.dinh, lg.fortune.mau, lg.fortune.ky];

        const chi = [lg.fortune.than, lg.fortune.dau, lg.fortune.tuat, lg.fortune.hoi, lg.fortune.ti, lg.fortune.suu, lg.fortune.dan, lg.fortune.mao, lg.fortune.thin, lg.fortune.ty, lg.fortune.ngo, lg.fortune.vi];

        const rootDate = moment('06/07/2022', 'DD/MM/YYYY', true);

        const dayBetween = rootDate.isBefore(mmt) ? mmt.diff(rootDate, 'days') % 60 : (60 - rootDate.diff(mmt, 'days') % 60) % 60;

        const lunarlongyear = can[lunar.year % 10] + " " + chi[lunar.year % 12];
        const lunarlongday = can[dayBetween % 10] + " " + chi[dayBetween % 12];
        const lunarlongmonth = can[(((lunar.year % 5 - 1) * 2 + 10) % 10 + lunar.month - 1) % 10] + " " + chi[(lunar.month + 5) % 12];

        if (lang === 'vi_VN') {
            embed.setDescription(`Dương lịch: **Ngày ${extractDay} tháng ${extractMonth} năm ${extractYear}**\nÂm lịch: **Ngày ${lunarlongday} tháng ${lunarlongmonth} năm ${lunarlongyear} (${lunar.day}/${lunar.month}/${lunar.year})**`);
        } else if (lang === 'en_US') {
            embed.setDescription(`Gregorian Calendar: **${month[extractMonth]} ${extractDay}, ${extractYear}**\nLunar Calendar: **${lunarlongday} day, ${lunarlongmonth} month, ${lunarlongyear} year (${month[lunar.month]} ${lunar.day}, ${lunar.year})**`);
        }

        request.reply({ embeds: [embed] });
    } else {
        const gregorian = convertAmDuong(extractDay, extractMonth, extractYear, 0, 7);

        if (gregorian[0] === 0) {
            await request.reply(lg.error.formatError);
            return;
        }

        const gregorianNhuan = convertAmDuong(extractDay, extractMonth, extractYear, 1, 7);

        const mmt = moment(`${convertTo2DigitNumber(gregorian[0])}/${convertTo2DigitNumber(gregorian[1])}/${convertTo2DigitNumber(gregorian[2])}`, 'DD/MM/YYYY', true);

        const month = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const can = [lg.fortune.canh, lg.fortune.tan, lg.fortune.nham, lg.fortune.quy, lg.fortune.giap, lg.fortune.at, lg.fortune.binh, lg.fortune.dinh, lg.fortune.mau, lg.fortune.ky];

        const chi = [lg.fortune.than, lg.fortune.dau, lg.fortune.tuat, lg.fortune.hoi, lg.fortune.ti, lg.fortune.suu, lg.fortune.dan, lg.fortune.mao, lg.fortune.thin, lg.fortune.ty, lg.fortune.ngo, lg.fortune.vi];

        const rootDate = moment('06/07/2022', 'DD/MM/YYYY', true);

        const dayBetween = rootDate.isBefore(mmt) ? mmt.diff(rootDate, 'days') % 60 : (60 - rootDate.diff(mmt, 'days') % 60) % 60;

        const lunarlongyear = can[extractYear % 10] + " " + chi[extractYear % 12];
        const lunarlongday = can[dayBetween % 10] + " " + chi[dayBetween % 12];
        const lunarlongmonth = can[(((extractYear % 5 - 1) * 2 + 10) % 10 + extractMonth - 1) % 10] + " " + chi[(extractMonth + 5) % 12];

        if (lang === 'vi_VN') {
            embed.setDescription(`Âm lịch: **Ngày ${lunarlongday} tháng ${lunarlongmonth} năm ${lunarlongyear} (${extractDay}/${extractMonth}/${extractYear})**\nDương lịch: **Ngày ${gregorian[0]} tháng ${gregorian[1]} năm ${gregorian[2]}**${gregorianNhuan[0] === 0 ? `` : ` và **Ngày ${gregorianNhuan[0]} tháng ${gregorianNhuan[1]} năm ${gregorianNhuan[2]}**`}`);
        } else if (lang === 'en_US') {
            embed.setDescription(`Lunar Calendar: **${lunarlongday} day, ${lunarlongmonth} month, ${lunarlongyear} year (${month[extractMonth]} ${extractDay}, ${extractYear})**\nGregorian Calendar: **${month[gregorian[1]]} ${gregorian[0]}, ${gregorian[2]}**${gregorianNhuan[0] === 0 ? `` : ` and **${month[gregorianNhuan[1]]} ${gregorianNhuan[0]}, ${gregorianNhuan[2]}**`}`);
        }

        request.reply({ embeds: [embed] });
    }
}

module.exports.run = run;

module.exports.help = help;