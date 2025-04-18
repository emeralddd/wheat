const { SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const moment = require('moment');
const { Request } = require('../../structure/Request');
const { dateInput } = require('../../modules/dateParse');
const { AmDuongLich, getSunLongitudeOfDate } = require('../../structure/AmDuongLich');

const help = {
    name: "lichvannien",
    group: "ftelling",
    example: [" a 25/11/2022", " d 1/1/2022"],
    aliases: ["xemngay", "duongam", "amduong", "doingayamduong", "doingayduongam"],
    data: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName('today')
                .setDescription('See Vietnamese "Van Nien" calendar for today')
                .setDescriptionLocalization('vi', 'Xem lịch Vạn Niên hôm nay')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('anotherday')
                .setDescription('See Vietnamese "Van Nien" calendar for another day')
                .setDescriptionLocalization('vi', 'Xem lịch Vạn Niên cho một ngày khác')
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

        //Name of Nap Am

        const napAmList = [
            "Hải Trung Kim",
            "Lô Trung Hỏa",
            "Đại Lâm Mộc",
            "Lộ Bàng Thổ",
            "Kiếm Phong Kim",
            "Sơn Đầu Hỏa",
            "Giản Hạ Thủy",
            "Thành Đầu Thổ",
            "Bạch Lạp Kim",
            "Dương Liễu Mộc",
            "Tuyền Trung Thủy",
            "Ốc Thượng Thổ",
            "Tích Lịch Hỏa",
            "Tùng Bách Mộc",
            "Trường Lưu Thủy",
            "Sa Trung Kim",
            "Sơn Hạ Hỏa",
            "Bình Địa Mộc",
            "Bích Thượng Thổ",
            "Kim Bạc Kim",
            "Phú Đăng Hỏa",
            "Thiên Hà Thủy",
            "Đại Trạch Thổ",
            "Thoa Xuyến Kim",
            "Tang Đố Mộc",
            "Đại Khê Thủy",
            "Sa Trung Thổ",
            "Thiên Thượng Hỏa",
            "Thạch Lựu Mộc",
            "Đại Hải Thủy"
        ];

        const napAmMeaningList = {
            "vi": [
                "Vàng dưới biển",
                "Lửa trong lò",
                "Cây trong rừng",
                "Đất ven đường",
                "Vàng mũi kiếm",
                "Lửa đỉnh núi",
                "Nước khe ngầm",
                "Đất trên thành",
                "Vàng trong nến",
                "Cây dương liễu",
                "Nước giữa suối",
                "Đất trên mái",
                "Lửa sấm sét",
                "Cây tùng bách",
                "Nước sông dài",
                "Vàng trong cát",
                "Lửa dưới núi",
                "Cây đồng bằng",
                "Đất trên vách",
                "Bạch kim",
                "Lửa đèn dầu",
                "Nước trên trời",
                "Đất đầm lớn",
                "Vàng trang sức",
                "Cây dâu tằm",
                "Nước suối lớn",
                "Đất trong cát",
                "Lửa trên trời",
                "Cây thạch lựu",
                "Nước biển lớn"
            ],
            "en": [
                "Sea metal",
                "Furnance fire",
                "Forest wood",
                "Road earth",
                "Sword metal",
                "Volcanic fire",
                "Creek water",
                "Fortress earth",
                "Pewter metal",
                "Willow wood",
                "Stream water",
                "Roof tiles earth",
                "Lightning fire",
                "Conifer wood",
                "River water",
                "Sand metal",
                "Forest fire",
                "Meadow wood",
                "Adobe earth",
                "Platinum",
                "Lamp fire",
                "Sky water",
                "Stage station earth",
                "Jewellery metal",
                "Mulberry wood",
                "Rapids water",
                "Desert earth",
                "Sun fire",
                "Pomegranate wood",
                "Great ocean water",
            ]
        }

        //Name of Hoang Dao/Hac Dao
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

        // 1 for Hoang Dao, 0 for Hac Dao
        const hoangHacList = [1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0];

        // Index of Chi of Thanh Long day of that month
        const indexOfChiOfThanhLongDay = (typedDate.ngayAmLich.month - 1) % 6 * 2;

        // Index of Chi of that day
        const indexOfChiDay = typedDate.getChiIndexOfDay();

        //If Thanh Long is Ty day, then next Minh Duong for Suu day, ...
        const indexOfSao = (indexOfChiDay - indexOfChiOfThanhLongDay + 12) % 12;

        const embed = bot.wheatSampleEmbedGenerate();

        const gioHoangDao = [], gioHacDao = [];
        let hour = 23;

        const indexOfChiOfThanhLongHour = (indexOfChiDay + 4) % 6 * 2;

        let indexOfFirstSaoInDay = (12 - indexOfChiOfThanhLongHour) % 12;

        for (let chiIndex = 0; chiIndex < 12; chiIndex++) {
            if (hoangHacList[indexOfFirstSaoInDay]) {
                gioHoangDao.push(`${typedDate.nameOfChi[chiIndex]} (${hour}h-${(hour + 2) % 24}h)`);
            } else {
                gioHacDao.push(`${typedDate.nameOfChi[chiIndex]} (${hour}h-${(hour + 2) % 24}h)`);
            }

            indexOfFirstSaoInDay = (indexOfFirstSaoInDay + 1) % 12;
            hour = (hour + 2) % 24;
        }

        const nhiThapBatTuList = [
            "Giác (Thuồng luồng)",
            "Cang (Rồng)",
            "Đê (Nhím)",
            "Phòng (Thỏ)",
            "Tâm (Chồn)",
            "Vĩ (Cọp)",
            "Cơ (Beo)",
            "Đẩu (Cua)",
            "Ngưu (Trâu)",
            "Nữ (Dơi)",
            "Hư (Chuột)",
            "Nguy (Én)",
            "Thất (Lợn)",
            "Bích (Rái cá)",
            "Khuê (Sói)",
            "Lâu (Chó)",
            "Vị (Trĩ)",
            "Mão (Gà)",
            "Tất (Chim)",
            "Chủy (Khỉ)",
            "Sâm (Vượn)",
            "Tỉnh (Hươu bướu)",
            "Quỷ (Dê)",
            "Liễu (Hoẵng)",
            "Tinh (Ngựa)",
            "Trương (Hươu)",
            "Dực (Rắn)",
            "Chẩn (Giun)"
        ]

        // 03/04/2025 is a day with Giac star
        const giacDay = moment('03/04/2025', 'DD/MM/YYYY', true);
        const dayBetweenGiacDay = giacDay.isBefore(typedDate.moment) ? typedDate.moment.diff(giacDay, 'days') % 28 : (28 - giacDay.diff(typedDate.moment, 'days') % 28) % 28;

        const kienTruThapNhiKhachList = [
            "Kiến",
            "Trừ",
            "Mãn",
            "Bình",
            "Định",
            "Chấp",
            "Phá",
            "Nguy",
            "Thành",
            "Thu",
            "Khai",
            "Bế"
        ];

        //Thang 1 Kien Dan, Thang 2 Kien Mao, Thang 3 Kien Thin, ...
        const chiOfKienThatMonth = (typedDate.ngayAmLich.month + 1) % 12;

        const kienOfDay = (indexOfChiDay - chiOfKienThatMonth + 12) % 12;

        const tietKhiList = {
            'vi': [
                "Xuân phân",
                "Thanh minh",
                "Cốc vũ",
                "Lập hạ",
                "Tiểu mãn",
                "Mang chủng",
                "Hạ chí",
                "Tiểu thử",
                "Đại thử",
                "Lập thu",
                "Xử thử",
                "Bạch lộ",
                "Thu phân",
                "Hàn lộ",
                "Sương giáng",
                "Lập đông",
                "Tiểu tuyết",
                "Đại tuyết",
                "Đông chí",
                "Tiểu hàn",
                "Đại hàn",
                "Lập xuân",
                "Vũ thủy",
                "Kinh trập"
            ],
            "en": [
                "Spring Equinox",
                "Pure Brightness",
                "Grain Rain",
                "Beginning of Summer",
                "Grain Buds",
                "Grain In Ear",
                "Summer Solstice",
                "Moderate Heat",
                "Major Heat",
                "Beginning of Autumn",
                "End of Heat",
                "White Dew",
                "Autumn Equinox",
                "Cold Dew",
                "Frost's Descent",
                "Beginning of Winter",
                "Minor Snow",
                "Major Snow",
                "Winter Solstice",
                "Minor Cold",
                "Major Cold",
                "Beginning of Spring",
                "Rain Water",
                "Awakening of Insects"
            ]
        };

        //Xuan Phan: 0deg - 15deg ...
        const sunLongToday = getSunLongitudeOfDate(typedDate.ngayDuongLich.day, typedDate.ngayDuongLich.month, typedDate.ngayDuongLich.year, 7);

        const momentOfTomorrow = typedDate.moment.clone();
        momentOfTomorrow.add(1, 'day');

        const sunLongTomorrow = getSunLongitudeOfDate(Number(momentOfTomorrow.format("DD")), Number(momentOfTomorrow.format("MM")), Number(momentOfTomorrow.format("YYYY")), 7);

        let indexOfTietKhi = 0;
        for (; indexOfTietKhi < 24; indexOfTietKhi++) {
            const firstDeg = indexOfTietKhi * 15;
            const nextDeg = (indexOfTietKhi + 1) * 15;

            if (firstDeg <= sunLongToday && sunLongToday < nextDeg) {
                if (sunLongTomorrow + (sunLongTomorrow < 15 ? 360 : 0) > nextDeg + 0.001) {
                    indexOfTietKhi++;
                }
                break;
            }
        }

        embed.setTitle(typedDate.getNgayDuongLich());
        embed.addFields(
            {
                name: t('calendar.lunarCalendar'),
                value: t('calendar.lunarDate', {
                    ...typedDate.ngayAmLich, lDay: typedDate.getCanChiDay(), lMonth: typedDate.getCanChiMonth() + (leap ? ' (' + t('calendar.leap') + ')' : ''), lYear: typedDate.getCanChiYear()
                })
            },
            {
                name: t('calendar.nguHanh'),
                value: t('calendar.nguHanhDate', {
                    day: napAmList[Math.floor(typedDate.getDayId() / 2)],
                    mday: napAmMeaningList[request.language][Math.floor(typedDate.getDayId() / 2)],
                    month: napAmList[Math.floor(typedDate.getMonthId() / 2)],
                    mmonth: napAmMeaningList[request.language][Math.floor(typedDate.getMonthId() / 2)],
                    year: napAmList[Math.floor(typedDate.getYearId() / 2)],
                    myear: napAmMeaningList[request.language][Math.floor(typedDate.getYearId() / 2)]
                })
            },
            {
                name: t(`calendar.ngay${hoangHacList[indexOfSao] ? 'Hoang' : 'Hac'}Dao`),
                value: `${saoList[indexOfSao]} ${hoangHacList[indexOfSao] ? 'Hoàng' : 'Hắc'} Đạo`
            },
            {
                name: t('calendar.gioHoangDao'),
                value: gioHoangDao.join(', ')
            },
            {
                name: t('calendar.gioHacDao'),
                value: gioHacDao.join(', ')
            },
            {
                name: t('calendar.tietKhi'),
                value: tietKhiList[request.language][indexOfTietKhi],
                inline: true
            },
            {
                name: t('calendar.truc'),
                value: kienTruThapNhiKhachList[kienOfDay],
                inline: true
            },
            {
                name: t('calendar.nhiThapBatTu'),
                value: nhiThapBatTuList[dayBetweenGiacDay],
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