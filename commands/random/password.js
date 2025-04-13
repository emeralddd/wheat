const { SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const { Request } = require('../../structure/Request');

const help = {
    name: "password",
    group: "random",
    aliases: ["pass", "mk", "passgen", "autopass", "taomk", "matkhau"],
    example: [" 12"],
    data: new SlashCommandBuilder()
        .addIntegerOption(option =>
            option.setName('length')
                .setMinValue(8)
                .setMaxValue(100)
                .setDescription('[8,100]')
                .setRequired(true)
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, t }) => {
    const len = Number(request.isMessage ? args[1] : request.interaction.options.getInteger('length'));

    if (!len) {
        await request.reply(t('error.passwordLengthError'));
        return;
    }

    if (len > 100 || len < 8) {
        await request.reply(t('error.passwordLengthError'));
        return;
    }

    const listSymbol = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 123, 124, 125, 126];
    let lower, upper, number, symbol, pass = [];
    lower = upper = Math.floor(len / 10 * 3);
    number = Math.floor(len / 5);
    symbol = len - lower - upper - number;
    while (lower--) {
        pass.push(bot.wheatRandomNumberBetween(97, 122));
        pass.push(bot.wheatRandomNumberBetween(65, 90));
    }
    while (number--) {
        pass.push(bot.wheatRandomNumberBetween(48, 57));
    }
    while (symbol--) {
        pass.push(bot.wheatRandomElementFromArray(listSymbol));
    }
    pass = bot.wheatShuffleArray(pass);
    const str = String.fromCharCode.apply(null, pass);
    await request.reply(t('random.passwordIs', { pass: str }));
}

module.exports.run = run;

module.exports.help = help;