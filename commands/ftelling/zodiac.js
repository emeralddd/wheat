const bot = require('wheat-better-cmd');
const { AttachmentBuilder, Message, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const moment = require('moment');

const help = {
    name: "zodiac",
    group: "ftelling",
    aliases: ["hoangdao"],
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('date')
                .setDescription('<DD/MM>')
                .setRequired(true)
        )
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 * @param {String[]} obj.args
 */

const run = async ({ message, interaction, args, lg }) => {
    const embed = bot.wheatSampleEmbedGenerate();
    const date = (args ? args[1] : interaction.options.getString('date')) + "/2020";
    message = message || interaction;
    const mmt = moment(date, 'DD/MM/YYYY', true);
    if (!mmt.isValid()) {
        await bot.wheatSendErrorMessage(message, lg.error.formatError);
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

    embed.setAuthor({ name: `⋗ ${lg.fortune.zodiacth}: ${String(pos + 1)}` });
    embed.setTitle(zodiac[pos].unicode + " " + zodiac[pos].name);
    embed.addFields({
        name: `${lg.fortune.characteristic}`,
        value: `⋄ ${lg.fortune.time1}: ${startTime[pos].format('DD/MM')} ${lg.fortune.to} ${startTime[(pos + 1) % 12].subtract(1, 'days').format('DD/MM')}\n⋄ ${lg.fortune.eclipticLongitude}: ${pos * 30}° ${lg.fortune.to} ${(pos + 1) * 30}°`
    });

    for (let i = 0; i < zodiac[pos].personality.length; i++) {
        embed.addFields({
            name: i === 0 ? 'Tính cách' : '⋇',
            value: zodiac[pos].personality[i]
        });
    }

    const attachment = new AttachmentBuilder(`./assets/image/zodiacImage/${pos + 1}.png`, `${pos + 1}.png`);
    embed.setThumbnail(`attachment://${pos + 1}.png`);

    await bot.wheatEmbedAttachFilesSend(message, [embed], [attachment]);
}

module.exports.run = run;

module.exports.help = help;