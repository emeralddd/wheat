const bot = require('wheat-better-cmd');
const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const moment = require('moment');
const { Request } = require('../../structure/Request');
const { dateInput, convertTo2DigitNumber } = require('../../modules/dateParse');

const help = {
    name: "zodiac",
    group: "ftelling",
    aliases: ["hoangdao"],
    example: [" 4/3"],
    data: new SlashCommandBuilder()
        .addIntegerOption(option =>
            option.setName('day')
                .setDescription('day')
                .setDescriptionLocalization('vi', 'ngày')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(31)
        )
        .addIntegerOption(option =>
            option.setName('month')
                .setDescription('month')
                .setDescriptionLocalization('vi', 'tháng')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(12)
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, t }) => {
    const embed = bot.wheatSampleEmbedGenerate();

    const [extractDay, extractMonth] = dateInput(request, args && args.length > 1 ? args[1] : "", '/', ['day', 'month']);

    const mmt = moment(`${convertTo2DigitNumber(extractDay)}/${convertTo2DigitNumber(extractMonth)}/2020`, 'DD/MM/YYYY', true);

    if (!mmt.isValid()) {
        await request.reply(t('error.formatError'));
        return;
    }

    const zodiac = await bot.wheatReadJSON('./assets/content/zodiacMeaning.json');

    const startTime = ["21/03", "20/04", "21/05", "22/06", "23/07", "23/08", "23/09", "23/10", "23/11", "22/12", "20/01", "19/02"];

    for (let i = 0; i < 12; i++) {
        startTime[i] = moment(startTime[i] + "/2020", "DD/MM/YYYY");
    }

    let pos;
    for (pos = 0; pos < 12; pos++) {
        if (mmt.isBetween(startTime[pos], startTime[(pos + 1) % 12], 'days', '[)')) {
            break;
        }
    }
    if (pos === 12) pos = 9;

    embed.setAuthor({ name: `⋗ ${t('astro.zodiacth')}: ${String(pos + 1)}` });
    embed.setTitle(zodiac[pos].unicode + " " + zodiac[pos].name);
    embed.addFields({
        name: t('astro.characteristic'),
        value: t('astro.zodiacDesc', {
            startTime: startTime[pos].format('DD/MM'),
            endTime: startTime[(pos + 1) % 12].subtract(1, 'days').format('DD/MM'),
            startDeg: pos * 30,
            endDeg: (pos + 1) * 30
        })
    });

    for (let i = 0; i < zodiac[pos].personality.length; i++) {
        embed.addFields({
            name: i === 0 ? t('astro.personality') : '⋇',
            value: zodiac[pos].personality[i]
        });
    }

    const attachment = new AttachmentBuilder(`./assets/image/zodiacImage/${pos + 1}.png`, `${pos + 1}.png`);
    embed.setThumbnail(`attachment://${pos + 1}.png`);

    await request.reply({ embeds: [embed], files: [attachment] });
}

module.exports.run = run;

module.exports.help = help;