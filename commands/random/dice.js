const { SlashCommandBuilder } = require('discord.js');
const { Request } = require('../../structure/Request');

const help = {
    name: "dice",
    group: "random",
    aliases: ["xucxac", "xingau", "doxingau", "tungxucxac", "xn", "xx"],
    example: ["", " 6 10 3"],
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('dices')
                .setDescription('[dice 1] [dice 2] [dice 3] [dice 4] ...')
                .setDescriptionLocalization('vi', '[số mặt ở xúc xắc 1] [xúc xắc 2] [xúc xắc 3] ...')
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, t }) => {
    const rd = [];

    if (request.isInteraction) {
        args = [];
        if (request.interaction.options.getString('dices')) {
            const tmp = request.interaction.options.getString('dices').split(' ');
            for (const i of tmp) {
                if (i !== '') args.push(i);
            }
        }
    }

    for (const face of args) {
        if (Number(face)) {
            rd.push({
                face: face,
                dice: Math.floor(Math.random() * Number(face) + 1)
            });
        }
    }

    if (rd.length === 0) rd.push({ face: 6, dice: Math.floor(Math.random() * 6 + 1) });

    let sf = "", sd = "", sum = 0;
    rd.forEach(e => {
        sf += e.face + " "
        sd += String(e.dice) + " "
        sum += e.dice;
    });

    await request.reply(t('random.dices', { faces: sf, dices: sd, sum }));
}

module.exports.run = run;

module.exports.help = help;