const { SlashCommandBuilder } = require('discord.js');
const { convertDuongAm } = require('../../modules/getLunarDate');
const bot = require('wheat-better-cmd');
const moment = require('moment');
const { Request } = require('../../structure/Request');

const help = {
    name: "doingayduongam",
    group: "ftelling",
    aliases: ["duongam"],
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('date')
                .setDescription('<DD/MM/YYYY>')
                .setRequired(true)
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
*/

const run = async ({ request, args, lg, lang }) => {
    const embed = bot.wheatSampleEmbedGenerate();
    const date = request.isMessage ? args[1] : request.interaction.options.getString('date');
    const mmt = moment(date, 'DD/MM/YYYY', true);

    if (!mmt.isValid()) {
        await request.reply(lg.error.formatError);
        return;
    }

    const ngay = Number(mmt.format('DD'));
    const thang = Number(mmt.format('MM'));
    const nam = Number(mmt.format('YYYY'));

    const lunar = convertDuongAm(ngay, thang, nam);

    const month = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const can = [lg.fortune.canh, lg.fortune.tan, lg.fortune.nham, lg.fortune.quy, lg.fortune.giap, lg.fortune.at, lg.fortune.binh, lg.fortune.dinh, lg.fortune.mau, lg.fortune.ky];

    const chi = [lg.fortune.than, lg.fortune.dau, lg.fortune.tuat, lg.fortune.hoi, lg.fortune.ti, lg.fortune.suu, lg.fortune.dan, lg.fortune.mao, lg.fortune.thin, lg.fortune.ty, lg.fortune.ngo, lg.fortune.vi];

    const rootDate = moment('06/07/2022', 'DD/MM/YYYY', true);

    const dayBetween = rootDate.isBefore(mmt) ? mmt.diff(rootDate, 'days') % 60 : (60 - rootDate.diff(mmt, 'days') % 60) % 60;

    const lunarlongyear = can[lunar.year % 10] + " " + chi[lunar.year % 12];
    const lunarlongday = can[dayBetween % 10] + " " + chi[dayBetween % 12];
    const lunarlongmonth = can[(((lunar.year % 5 - 1) * 2 + 10) % 10 + lunar.month - 1) % 10] + " " + chi[(lunar.month + 5) % 12];

    if (lang === 'vi_VN') {
        embed.setDescription(`Dương lịch: **Ngày ${ngay} tháng ${thang} năm ${nam}**\nÂm lịch: **Ngày ${lunarlongday} tháng ${lunarlongmonth} năm ${lunarlongyear} (${lunar.day}/${lunar.month}/${lunar.year})**`);
    } else if (lang === 'en_US') {
        embed.setDescription(`Gregorian Calendar: **${month[thang]} ${ngay}, ${nam}**\nLunar Calendar: **${lunarlongday} day, ${lunarlongmonth} month, ${lunarlongyear} year (${month[lunar.month]} ${lunar.day}, ${lunar.year})**`);
    }

    request.reply({ embeds: [embed] });
}

module.exports.run = run;

module.exports.help = help;