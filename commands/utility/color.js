const { Client, AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const { createCanvas } = require('@napi-rs/canvas');
const { Request } = require('../../structure/Request');

const help = {
    name: "color",
    group: "utility",
    aliases: ["mau", "sac", "clr"],
    data: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName('random')
                .setDescription('random color')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rgb')
                .setDescription('get color by rgb code')
                .addIntegerOption(option =>
                    option.setName('red')
                        .setDescription('red code')
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(255)
                )
                .addIntegerOption(option =>
                    option.setName('green')
                        .setDescription('green code')
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(255)
                )
                .addIntegerOption(option =>
                    option.setName('blue')
                        .setDescription('blue code')
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(255)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('hex')
                .setDescription('get color by hex code')
                .addStringOption(option =>
                    option.setName('hex')
                        .setDescription('eg: #ffffff')
                        .setRequired(true)
                        .setMinLength(7)
                        .setMaxLength(7)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('int')
                .setDescription('get color by int')
                .addIntegerOption(option =>
                    option.setName('int')
                        .setDescription('[0,16777215]')
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(16777215)
                )
        )
}

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, lg }) => {
    let code = request.isMessage ? args[1] : null;
    let deccode = bot.wheatRandomNumberBetween(0, 16777215);

    if (code || (request.isInteraction && request.interaction.options.getSubcommand() !== 'random')) {
        if ((request.isInteraction && request.interaction.options.getSubcommand() === 'rgb') || ((!request.isInteraction) && code.includes(','))) {
            let red, green, blue;
            if (request.isInteraction) {
                red = request.interaction.options.getInteger('red');
                green = request.interaction.options.getInteger('green');
                blue = request.interaction.options.getInteger('blue');
            } else {
                const rgb = code.split(',');
                red = Number(rgb[0]);
                green = Number(rgb[1]);
                blue = Number(rgb[2]);
                if (!red || !green || !blue) {
                    await request.reply(lg.error.wrongColorCode);
                    return;
                }
                if (0 > red || red > 255 || 0 > green || green > 255 || 0 > blue || blue > 255) {
                    await request.reply(lg.error.wrongColorCode);
                    return;
                }
            }

            deccode = red * 65536 + green * 256 + blue;
        } else {
            if (request.isInteraction) {
                code = request.interaction.options.getString('hex') || request.interaction.options.getInteger('int');
            }

            if ((!Number.isInteger(code)) && (code[0] === '#' || code.startsWith('0x'))) {
                if (code[0] === '#' && code.length != 7) {
                    await request.reply(lg.error.wrongColorCode);
                    return;
                }
                const int = parseInt(code[0] === '#' ? '0x' + code.substr(1, 6) : code, 16);
                if (!int) {
                    await request.reply(lg.error.wrongColorCode);
                    return;
                }
                deccode = int;
            } else {
                const int = Number(code);
                if (!int) {
                    await request.reply(lg.error.wrongColorCode);
                    return;
                }
                if (int < 0 || int > 16777215) {
                    await request.reply(lg.error.wrongColorCode);
                    return;
                }
                deccode = int;
            }
        }
    }
    const red = (deccode & 0xff0000) >> 16;
    const green = (deccode & 0x00ff00) >> 8;
    const blue = (deccode & 0x0000ff);

    let hexa = deccode.toString(16);
    while (hexa.length != '6') hexa = "0" + hexa;
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = `#${hexa}`;
    ctx.fillRect(0, 0, 200, 200);

    const embed = bot.wheatSampleEmbedGenerate();
    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: `${hexa}.png` });
    embed.setTitle(`🎨 ${lg.main.colorCode}: #${hexa}`);
    embed.setDescription(`HEXA: **#${hexa}**\nDEC: **${deccode}**\nRGB: **(${red},${green},${blue})**`);
    embed.setThumbnail(`attachment://${hexa}.png`);
    await request.reply({ embeds: [embed], files: [attachment] });
}

module.exports.run = run;

module.exports.help = help;