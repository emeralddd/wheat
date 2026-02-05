const bot = require('wheat-better-cmd');
const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { Request } = require('../../structure/Request');
const moment = require('moment');
const { dateInput, convertTo2DigitNumber } = require('../../modules/dateParse');

const help = {
    name: "numerology",
    group: "ftelling",
    aliases: ["thansohoc", "tsh", "nhansohoc", "nsh"],
    example: [" 5/12/2013"],
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
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('year')
                .setDescriptionLocalization('vi', 'năm')
                .setRequired(true)
                .setMinValue(1)
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, t }) => {
    const embed = bot.wheatSampleEmbedGenerate();
    const embed1 = bot.wheatSampleEmbedGenerate();
    const [extractDay, extractMonth, extractYear] = dateInput(request, args && args.length > 1 ? args[1] : "", '/', ['day', 'month', 'year']);

    const mmt = moment(`${convertTo2DigitNumber(extractDay)}/${convertTo2DigitNumber(extractMonth)}/${convertTo2DigitNumber(extractYear)}`, 'DD/MM/YYYY', true);

    if (!mmt.isValid()) {
        await request.reply(t('error.formatError'));
        return;
    }

    const number = await bot.wheatReadJSON('./assets/content/vi/numerologyRulingNumber_new.json');

    let sumOfDigit = mmt.format('DDMMYYYY').split('').reduce((prev, cur) => prev + Number(cur), 0);

    while (sumOfDigit !== 22 && sumOfDigit > 11) {
        let sumAgain = 0;
        while (sumOfDigit !== 0) {
            sumAgain += sumOfDigit % 10;
            sumOfDigit = Math.floor(sumOfDigit / 10);
        }

        sumOfDigit = sumAgain;
    }
    const rullingNumber = number[sumOfDigit];

    if (sumOfDigit === 22) sumOfDigit = "22/4";

    embed.setTitle(t('numerology.yourRullingNumberIs', {
        username: request.member.displayName,
        number: sumOfDigit
    }));

    embed.setDescription(rullingNumber.description);
    embed.data.fields = [];
    embed1.data.fields = [];
    embed1.setFooter({ text: t('numerology.numerologyDetails') });

    embed.addFields({
        name: `◌ ${t('numerology.lifePurpose')}`,
        value: rullingNumber.lifePurpose
    }, {
        name: `◌ ${t('numerology.good')}`,
        value: rullingNumber.bestExpression
    }, {
        name: `◌ ${t('numerology.special')}`,
        value: rullingNumber.distinctiveTraits
    });

    if (rullingNumber.distinctiveTraits1) {
        embed.addFields({
            name: `▿`,
            value: rullingNumber.distinctiveTraits1
        });
    }
    embed1.addFields({
        name: `◌ ${t('numerology.bad')}`,
        value: rullingNumber.negative
    }, {
        name: `◌ ${t('numerology.sol')}`,
        value: rullingNumber.sol
    });

    if (rullingNumber.sol1) {
        embed1.addFields({
            name: `▿`,
            value: rullingNumber.sol1
        });
    }

    embed1.addFields({
        name: `◌ ${t('numerology.job')}`,
        value: rullingNumber.job
    }, {
        name: `◌ ${t('numerology.summary')}`,
        value: rullingNumber.summary
    });

    if (sumOfDigit === "22/4") sumOfDigit = 22;

    const attachment = new AttachmentBuilder(`./assets/image/numberImage/${sumOfDigit}.png`, `${sumOfDigit}.png`);
    embed.setThumbnail(`attachment://${sumOfDigit}.png`);

    await request.reply({ embeds: [embed], files: [attachment] });
    await request.follow({ embeds: [embed1] });
}

module.exports.run = run;

module.exports.help = help;