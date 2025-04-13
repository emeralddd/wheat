const { SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const moment = require('moment');
const { Request } = require('../../structure/Request');
const { dateInput, convertTo2DigitNumber } = require('../../modules/dateParse');
const { AmDuongLich } = require('../../structure/AmDuongLich');

const help = {
    name: "lichvannien",
    group: "ftelling",
    example: [" a 25/11/2022", " d 1/1/2022"],
    aliases: ["xemngay", "duongam", "amduong", "doingayamduong", "doingayduongam"],
    data: new SlashCommandBuilder()
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
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(31)
        )
        .addIntegerOption(option =>
            option.setName('month')
                .setDescription('month')
                .setDescriptionLocalization('vi', 'tháng')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(12)
        )
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('year')
                .setDescriptionLocalization('vi', 'năm')
                .setRequired(true)
                .setMinValue(1)
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
*/

const run = async ({ request, args, t }) => {
    const type = request.isMessage ? args[1] : request.interaction.options.getString('type');

    if (type !== 'd' && type !== 'a') {
        return request.reply(t('error.missingADOption'));
    }

    const [extractDay, extractMonth, extractYear] = dateInput(request, args ? args[2] : "", '/', ['day', 'month', 'year']);

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
                name: `Ngày ${saoList[indexOfSao]} ${hoangHacList[indexOfSao] ? 'Hoàng' : 'Hắc'} Đạo`,
                value: 'Tốt mọi việc'
            },
            {
                name: 'Giờ Hoàng Đạo',
                value: 'Ngay Thanh Long Hoang Dao'
            },
            {
                name: 'Giờ Hắc Đạo',
                value: 'Ngay Thanh Long Hoang Dao'
            },
            {
                name: 'Tiết khí',
                value: 'Ngay Thanh Long Hoang Dao'
            },
            {
                name: 'Trực',
                value: 'Thành'
            },
            {
                name: 'Nhị thập bát tú',
                value: 'Dực'
            },
            {
                name: 'Hướng xuất hành',
                value: 'Hỷ thần: Đông Bắc\nTài thần: Bắc\nHạc thần: Nam'
            },
            {
                name: 'Sao tốt',
                value: 'Thành'
            },
            {
                name: 'Sao xấu',
                value: 'Thành'
            }
        );

        embeds.push(embed);
    }


    await request.reply({ embeds });
}

module.exports.run = run;

module.exports.help = help;