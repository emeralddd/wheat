const bot = require('wheat-better-cmd');
const { SlashCommandBuilder } = require('discord.js');
const databaseManager = require('../../modules/databaseManager');
const { Request } = require('../../structure/Request');
require('dotenv').config({ path: 'secret.env' });

const help = {
    name: "tarotdefault",
    group: "setting",
    aliases: ["tarotset"],
    example: ["", " true", " false"],
    rate: 2000,
    data: new SlashCommandBuilder()
        .addBooleanOption(option =>
            option.setName('option')
                .setDescription('do you want to use reversed tarot card by default?')
                .setDescriptionLocalization('vi', 'bạn có muốn mặc định bốc cả bài ngược?')
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, t }) => {
    request.reply("Vui lòng sử dụng /mysettings để thay đổi cài đặt bài Tarot của bạn.\nPlease use /mysettings to change your tarot settings.");
}

module.exports.run = run;

module.exports.help = help;