const bot = require('wheat-better-cmd');
const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { Request } = require('../../structure/Request');
const moment = require('moment');

const help = {
    name: "numerology",
    group: "ftelling",
    aliases: ["thansohoc", "tsh", "nhansohoc", "nsh"],
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('date')
                .setDescription('<DD/MM/YYYY>')
                .setRequired(true)
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, lg }) => {
    const embed = bot.wheatSampleEmbedGenerate();
    const embed1 = bot.wheatSampleEmbedGenerate();
    const date = request.isMessage ? args[1] : request.interaction.options.getString('date');

    const mmt = moment(date, 'DD/MM/YYYY', true);
    if (!mmt.isValid()) {
        await request.reply(lg.error.formatError);
        return;
    }

    const number = await bot.wheatReadJSON('./assets/content/numerologyRulingNumber_new.json');
    let temp = mmt.format('DD/MM/YYYY');
    let tmp = 0;
    for (let i = 0; i < temp.length; i++) {
        if (temp[i] !== '/') tmp += Number(temp[i]);
    }
    temp = tmp;
    while (temp != 22 && temp > 11) {
        tmp = temp;
        temp = 0;
        while (tmp != 0) {
            temp += tmp % 10;
            tmp = Math.floor(tmp / 10);
        }
    }

    const num = number[temp];
    if (temp === 22) temp = "22/4";

    embed.setTitle(`▩ ${request.member.displayName}, ${lg.fortune.yourRullingNumberIs} **${temp}**`);
    if (temp === "22/4") temp = 22;
    embed.setDescription(num.description);
    embed.data.fields = [];
    embed1.data.fields = [];
    embed1.setFooter({ text: lg.fortune.numerologyDetails });

    embed.addFields({
        name: `◌ ${lg.fortune.lifePurpose}`,
        value: num.lifePurpose
    }, {
        name: `◌ ${lg.fortune.good}`,
        value: num.bestExpression
    }, {
        name: `◌ ${lg.fortune.special}`,
        value: num.distinctiveTraits
    });

    if (num.distinctiveTraits1) {
        embed.addFields({
            name: `▿`,
            value: num.distinctiveTraits1
        });
    }
    embed1.addFields({
        name: `◌ ${lg.fortune.bad}`,
        value: num.negative
    }, {
        name: `◌ ${lg.fortune.sol}`,
        value: num.sol
    });

    if (num.sol1) {
        embed1.addFields({
            name: `▿`,
            value: num.sol1
        });
    }

    embed1.addFields({
        name: `◌ ${lg.fortune.job}`,
        value: num.job
    }, {
        name: `◌ ${lg.fortune.summary}`,
        value: num.summary
    });

    const attachment = new AttachmentBuilder(`./assets/image/numberImage/${temp}.png`, `${temp}.png`);
    embed.setThumbnail(`attachment://${temp}.png`);

    await request.reply({ embeds: [embed], files: [attachment] });
    await request.follow({ embeds: [embed1] });
}

module.exports.run = run;

module.exports.help = help;