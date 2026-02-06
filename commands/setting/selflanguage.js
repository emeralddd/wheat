const bot = require('wheat-better-cmd');
const { SlashCommandBuilder } = require('discord.js');
const databaseManager = require('../../modules/databaseManager');
const { Request } = require('../../structure/Request');
const { languageList } = require('../../modules/languageBase');
require('dotenv').config({ path: 'secret.env' });

const help = {
    name: "selflanguage",
    group: "setting",
    aliases: ["selflang", "ngonngurieng", "nnr", "sl"],
    example: ["", " vi", " en", " unset"],
    rate: 2000,
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('language')
                .setDescription('choose self language')
                .setDescriptionLocalization('vi', 'chọn ngôn ngữ riêng')
                .addChoices(
                    { name: 'Tiếng Việt', value: 'vi' },
                    { name: 'English', value: 'en' },
                    { name: 'Không sử dụng/Unset', value: 'unset' }
                )
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, t, serverInfo }) => {
    request.reply("Vui lòng sử dụng /mysettings để thay đổi ngôn ngữ riêng của bạn.\nPlease use /mysettings to change your self language.");
}

module.exports.run = run;

module.exports.help = help;