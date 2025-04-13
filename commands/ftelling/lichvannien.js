const { SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const moment = require('moment');
const { Request } = require('../../structure/Request');
const { dateInput } = require('../../modules/dateParse');
const { AmDuongLich } = require('../../structure/AmDuongLich');

const help = {
    name: "lichvannien",
    group: "ftelling",
    example: [" a 25/11/2022", " d 1/1/2022"],
    aliases: ["xemngay", "duongam", "amduong", "doingayamduong", "doingayduongam"],
    data: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName('today')
                .setDescription('Van Nien for today')
                .setDescriptionLocalization('vi', 'xem ngày hôm nay')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('anydate')
                .setDescription('Van Nien for another date')
                .setDescriptionLocalization('vi', 'xem một ngày khác')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('the typed date is Lunar or Gregorian?')
                        .setDescriptionLocalization('vi', "ngày được nhập là Âm lịch hay Dương lịch?")
                        .setRequired(true)
                        .setChoices(
                            { name: 'Âm lịch (Lunar)', value: 'a' },
                            { name: 'Dương lịch (Gregorian)', value: 'd' },
                        )
                )
                .addIntegerOption(option =>
                    option.setName('day')
                        .setDescription('day')
                        .setDescriptionLocalization('vi', 'ngày')
                        .setMinValue(1)
                        .setMaxValue(31)
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('month')
                        .setDescription('month')
                        .setDescriptionLocalization('vi', 'tháng')
                        .setMinValue(1)
                        .setMaxValue(12)
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('year')
                        .setDescription('year')
                        .setDescriptionLocalization('vi', 'năm')
                        .setMinValue(1)
                        .setRequired(true)
                )
        )

}

/**
 * @param {object} obj
 * @param {Request} obj.request
*/

const run = async ({ request, args, t }) => {
    let type, extractDay, extractMonth, extractYear;

    if ((request.isMessage && args.length === 1) || (request.isInteraction && request.interaction.options.getSubcommand(false) === 'today')) {
        type = 'd';
        [extractDay, extractMonth, extractYear] = dateInput({ isMessage: true }, moment().format('DD/MM/YYYY'), '/', ['day', 'month', 'year']);
    } else {
        type = request.isMessage ? args[1] : request.interaction.options.getString('type');
        if (type !== 'd' && type !== 'a') {
            return request.reply(t('error.missingADOption'));
        }

        [extractDay, extractMonth, extractYear] = dateInput(request, args && args.length > 2 ? args[2] : "", '/', ['day', 'month', 'year']);
    }

    const embeds = [];

    for (let leap = 0; leap < 2; leap++) {
        if (type === 'd' && leap === 1) continue;

        const typedDate = new AmDuongLich(extractDay, extractMonth, extractYear, type === 'd' ? AmDuongLich.DuongLich : AmDuongLich.AmLich, leap);
        if (!typedDate.isValid()) {
            if (leap === 0) {
                return request.reply(t('error.formatError'));
            } else {
                break;
            }
        }
        typedDate.setLanguage(request.language);

        //Ngay Hoang Dao/Hac Dao
        const saoList = [
            "Thanh Long",
            "Minh Đường",
            "Thiên Hình",
            "Chu Tước",
            "Kim Quỹ",
            "Kim Đường",
            "Bạch Hổ",
            "Ngọc Đường",
            "Thiên Lao",
            "Nguyên Vũ",
            "Tư Mệnh",
            "Câu Trận"
        ];

        const hoangHacList = [1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0];

        const indexOfSao = 0;

        const embed = bot.wheatSampleEmbedGenerate();

        embed.setTitle(typedDate.getNgayDuongLich());
        embed.addFields(
            {
                name: t('calendar.lunarCalendar'),
                value: t('calendar.lunarDate', { ...typedDate.ngayAmLich, lDay: typedDate.getCanChiDay(), lMonth: typedDate.getCanChiMonth(), lYear: typedDate.getCanChiYear() })
            },
            {
                name: `Ngày ${hoangHacList[indexOfSao] ? 'Hoàng' : 'Hắc'} Đạo`,
                value: `${saoList[indexOfSao]} ${hoangHacList[indexOfSao] ? 'Hoàng' : 'Hắc'} Đạo`
            },
            {
                name: 'Giờ Hoàng Đạo',
                value: 'Tý (23h-1h), **Tý (23h-1h)**, Tý (23h-1h), Tý (23h-1h), Tý (23h-1h), Tý (23h-1h)'
            },
            {
                name: 'Giờ Hắc Đạo',
                value: 'Tý (23h-1h), Tý (23h-1h), Tý (23h-1h), Tý (23h-1h), Tý (23h-1h), Tý (23h-1h)'
            },
            {
                name: 'Tiết khí',
                value: 'Lập Xuân',
                inline: true
            },
            {
                name: 'Trực',
                value: 'Thành',
                inline: true
            },
            {
                name: 'Nhị thập bát tú',
                value: 'Chi',
                inline: true
            }
        );

        //To-do: Sao tốt, Sao xấu

        embeds.push(embed);
    }


    await request.reply({ embeds });
}

module.exports.run = run;

module.exports.help = help;