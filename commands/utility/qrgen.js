const bot = require('wheat-better-cmd');
const qrcode = require('qrcode');
const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { Request } = require('../../structure/Request');

const help = {
    name: "qrgen",
    group: "utility",
    aliases: ["taoqr", "qrgenerator", "qr"],
    example: [" helloworld"],
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('content')
                .setDescription('length<1601')
                .setRequired(true)
        )
}

/**
 * @param {object} obj
 * @param {String[]} obj.S
 * @param {Request} obj.request

 */

const run = async ({ S, request, t }) => {
    const embed = bot.wheatSampleEmbedGenerate();

    let content = "";

    if (request.isMessage) {
        let block = true;
        for (let i = 0; i < S.length; i++) {
            if (S[i] !== '' && block) {
                block = false;
                continue;
            }
            if (!block) {
                content += S[i] + " ";
            }
        }

        content = content.trimStart().trimEnd();
    } else {
        content = request.interaction.options.getString('content');
    }

    if (content.length === 0) {
        await request.reply(t('error.missingData'));
        return;
    }

    if (content.length > 1600) {
        await request.reply(t('error.wrongQrLength'));
        return;
    }

    qrcode.toBuffer(content, async (err, buffer) => {
        if (err) {
            await request.reply(t('error.undefinedError'));
            return;
        }
        const attachment = new AttachmentBuilder(buffer, { name: 'qr.png' });
        embed.setImage('attachment://qr.png');
        embed.setTitle(t('main.successExecution'));
        embed.setDescription(content);
        await request.reply({ embeds: [embed], files: [attachment] });
    });
}

module.exports.run = run;

module.exports.help = help;