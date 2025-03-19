const { Message, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const axios = require('axios').default;
require('dotenv').config({ path: 'secret.env' });
const moment = require('moment');
const he = require('he');

const help = {
    name: "tinhyeuchd",
    group: "ftelling",
    aliases: ['boi', 'tinh_yeu'],
    rate: 3000,
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('gioi_tinh')
                .setDescription('Nam: 1 va Nu: 0')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('ngay_sinh')
                .setDescription('<DD/MM/YYYY>')
                .setRequired(true)
        )
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 */

const run = async ({ message, interaction, args, lg }) => {
    const gioi_tinh = (args ? args[1] : interaction.options.getString('gioi_tinh'));
    let ngay_sinh = (args ? args[2] : interaction.options.getString('ngay_sinh'));

    message = message || interaction;

    ngay_sinh = moment(ngay_sinh, 'DD/MM/YYYY').format('YYYY-MM-DD');

    const data = {
        "gioi_tinh": gioi_tinh,
        "ngay_sinh": ngay_sinh
    }

    axios.post(`https://api.lichvannien.mobi/api/v1/boiTinhYeuChd`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if (!response.data.msg || response.data.msg.error_code !== 0) {
            bot.wheatSendErrorMessage(message, lg.error.undefinedError);
            return;
        }

        // Use regex to extract text from HTML
        const htmlContent = response.data.data.content;
        const decodedHtml = he.decode(htmlContent);
        const contentText = decodedHtml.replace(/<[^>]*>?/gm, '').replace(/img{[^}]*}/gm, '').replace(/ /gm, ' ');

        const embed = bot.wheatSampleEmbedGenerate();

        embed.setTitle("Kết quả bói tình yêu");
        embed.setDescription(contentText);

        bot.wheatEmbedSend(message, [embed]);
    }).catch(error => {
            bot.wheatSendErrorMessage(message, lg.error.undefinedError);
    });
}

module.exports.run = run;

module.exports.help = help;
