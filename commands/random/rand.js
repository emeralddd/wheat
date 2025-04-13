const { SlashCommandBuilder } = require('discord.js');
const { Request } = require('../../structure/Request');

const help = {
    name: "rand",
    group: "random",
    aliases: ["rd", "ngaunhien", "batky", "rdm", "r"],
    example: ["", " 10", " 5 10"],
    data: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName('default')
                .setDescription('random in [1,100]')
                .setDescriptionLocalization('vi', 'ngẫu nhiên trong đoạn [1,100]')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('1option')
                .setDescription('random in [1,max]')
                .setDescriptionLocalization('vi', 'ngẫu nhiên trong đoạn [1,max]')
                .addIntegerOption(option =>
                    option.setName('max')
                        .setDescription('max > 1')
                        .setMinValue(2)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('2options')
                .setDescription('random in [min,max]')
                .setDescriptionLocalization('vi', 'ngẫu nhiên trong đoạn [min,max]')
                .addIntegerOption(option =>
                    option.setName('min')
                        .setDescription('integer')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('max')
                        .setDescription('max >= min')
                        .setRequired(true)
                )
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, t }) => {
    let numberMIN = 0;
    let numberMAX = 0;

    if (request.isMessage) {
        numberMIN = Number(args[1]);
        numberMAX = Number(args[2]);

        if (!numberMIN && numberMIN !== 0) {
            numberMIN = 1;
            numberMAX = 100;
        }

        if (!numberMAX && numberMAX !== 0) {
            numberMAX = numberMIN;
            numberMIN = 1;
        }
    } else {
        const subcommand = request.interaction.options.getSubcommand(false);

        if (subcommand === 'default') {
            numberMIN = 1;
            numberMAX = 100;
        }

        if (subcommand === '1option') {
            numberMIN = 1;
            numberMAX = request.interaction.options.getInteger('max');
        }

        if (subcommand === '2options') {
            numberMIN = request.interaction.options.getInteger('min');
            numberMAX = request.interaction.options.getInteger('max');
        }
    }

    if (numberMIN > numberMAX) {
        const temp = numberMIN;
        numberMIN = numberMAX;
        numberMAX = temp;
    }

    const randomNumber = Math.floor(Math.random() * (numberMAX - numberMIN + 1) + numberMIN);
    await request.reply(t('random.randomNumInRange', { min: numberMIN, max: numberMAX, rand: randomNumber }));
}

module.exports.run = run;

module.exports.help = help;