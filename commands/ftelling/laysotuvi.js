const { Message, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const axios = require('axios').default;
require('dotenv').config({ path: 'secret.env' });
const moment = require('moment');
const he = require('he');
const { title } = require('process');

const help = {
    name: "laysotuvi",
    group: "ftelling",
    aliases: ['layso', 'tuvi'],
    rate: 3000,
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('full_name')
                .setDescription('Họ tên')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('gender')
                .setDescription('Giới tính')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('ngay_thang_nam')
                .setDescription('Ngày Tháng Năm sinh')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('gio_phut')
                .setDescription('Giờ phút sinh')
                .setRequired(true)
        )
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 */

const run = async ({ message, interaction, args, lg }) => {
    const prefix = '!'; 
    // Phân tích cú pháp lệnh để lấy tên đầy đủ
    args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'layso') {
        let full_name = '';
        while (!args[0].match(/^\d+$/)) {
            full_name += args.shift() + ' ';
        }
        full_name = full_name.trim(); // Loại bỏ khoảng trắng thừa

        // Tiếp tục xử lý các tham số khác...
        const gioi_tinh = args.shift();
        const ngay_thang_nam = args.shift();
        let gio_phut = args.shift();

        // Tách giờ và phút từ chuỗi
        let [gio, phut] = gio_phut.split(':');

        message = message || interaction;

        const mmt = moment(ngay_thang_nam, 'DD/MM/YYYY', true)
        if(!mmt.isValid()) {
            await bot.wheatSendErrorMessage(message,lg.error.formatError)
            return
        }
        const ngay = mmt.format('DD')
        const thang = mmt.format('MM')
        const nam = mmt.format('YYYY')


        const data = {
            "fullname": full_name,
            "gender": gioi_tinh,
            "day": ngay,
            "month": thang,
            "year": nam,
            "hour": gio,
            "minute": phut
        }

        axios.post(`https://api.lichvannien.mobi/api/v1/tuViLaSo`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (!response.data.msg || response.data.msg.error_code !== 0) {
                bot.wheatSendErrorMessage(message, lg.error.undefinedError);
                return;
            }

        // Use regex to extract text from HTML
        // const htmlContent = response.data.data.content;
        // const decodedHtml = he.decode(htmlContent);
        // const contentText = decodedHtml.replace(/<[^>]*>?/gm, '').replace(/img{[^}]*}/gm, '').replace(/ /gm, ' ');

        const embed = bot.wheatSampleEmbedGenerate();

        embed.setTitle("Kết quả lấy số tử vi");
        // for (let key in response.data.data) {
        //     embed.addField(key, response.data.data[key]);
        // }
        // Duyệt qua tất cả các mục trong dữ liệu trả về và thêm chúng vào embed
        // function convert(key){
        //     let title = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        //     return title;
        // }
        embed.addFields(
            {name: 'Bát Tự', value: response.data.data.bat_tu},
            {name: 'Tuổi', value: response.data.data.tuoi},
            {name: 'Ngày sinh Âm lịch', value: response.data.data.ngay_sinh_am_lich},
            {name: 'Bản mệnh', value: response.data.data.ban_menh},
            {name: 'Cục', value: response.data.data.cuc},
            {name: 'Mệnh', value: response.data.data.menh},
            {name: 'Phụ Mẫu', value: response.data.data.phu_mau},
            {name: 'Phúc Đức', value: response.data.data.phuc_duc},
            {name: 'Điền Trạch', value: response.data.data.dien_trach},
            {name: 'Nô Bộc', value: response.data.data.no_boc},
            {name: 'Thiên Di', value: response.data.data.thien_di},
            {name: 'Tật Ách', value: response.data.data.tat_ach},
            {name: 'Tai Bạch', value: response.data.data.tai_bach},
            {name: 'Tự Túc', value: response.data.data.tu_tuc},
            {name: 'Phu Thê', value: response.data.data.phu_the},
            {name: 'Huynh Đệ', value: response.data.data.huynh_de},
        );
        //embed.addFields("Phu Thê", "Phu Thê" + ": " + response.data.data.phu_the);
        // for (let key in response.data.data) {
        //     if (key === 'la_so') continue;
        //     // Chuyển đổi key từ dạng underscore_case sang Title Case và thêm vào phần mô tả của mục
        //     let title = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        //     embed.addField(title, title + ": " + response.data.data[key]);
        // }
        bot.wheatEmbedSend(message, [embed]);
        }).catch(error => {
            bot.wheatSendErrorMessage(message, lg.error.undefinedError);
        });
    }
}

module.exports.run = run;

module.exports.help = help;
