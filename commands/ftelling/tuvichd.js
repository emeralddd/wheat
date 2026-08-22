const { Message, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const axios = require('axios').default;
require('dotenv').config({ path: 'secret.env' });
const he = require('he');

const help = {
    name: "tuvichd",
    group: "ftelling",
    aliases: [],
    rate: 3000,
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('cung')
                .setDescription('Ten cung viet lien VD: sutu')
                .setRequired(true)
        )
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 */

const run = async ({ message, interaction, args, lg }) => {
    let cung = (args ? args[1] : interaction.options.getString('cung'));

    message = message || interaction;


    const data = {
        "cung": cung
    }

    axios.post(`https://api.lichvannien.mobi/api/v1/tuviCHDNgay`, data, {
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

        embed.setTitle("Kết quả bói tử vi theo cung hoàng đạo");
        embed.setDescription(contentText);

        bot.wheatEmbedSend(message, [embed]);
    }).catch(error => {
            bot.wheatSendErrorMessage(message, lg.error.undefinedError);
    });
}

module.exports.run = run;

module.exports.help = help;
