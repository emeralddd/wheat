const bot = require('wheat-better-cmd');
const { SlashCommandBuilder } = require('discord.js');
const databaseManager = require('../../modules/databaseManager');
const { Request } = require('../../structure/Request');
require('dotenv').config({ path: 'secret.env' });

const help = {
    name: "tarotdefault",
    group: "setting",
    aliases: ["tarotset"],
    rate: 2000,
    data: new SlashCommandBuilder()
        .addBooleanOption(option =>
            option.setName('option')
                .setDescription('do you want to use reversed tarot card by default?')
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, lg }) => {
    const embed = bot.wheatSampleEmbedGenerate();
    const memberId = request.member.id;
    const find = databaseManager.getMember(memberId);

    if (request.isInteraction) {
        args = [''];
        if (request.interaction.options.getBoolean('option') !== null) {
            args.push(request.interaction.options.getBoolean('option') ? 'true' : 'false');
        }
    }

    if (!args[1]) {
        try {
            if ((!find) || (find && !find.tarotReverseDefault)) {
                embed.setDescription(`Áp dụng cả lá bài ngược khi bốc bài Tarot: **Không**`);
            } else {
                embed.setDescription(`Áp dụng cả lá bài ngược khi bốc bài Tarot: **${find.tarotReverseDefault ? `Có` : `Không`}**`);
            }

            await request.reply({ embeds: [embed] });
        } catch (err) {
            console.log("tarotdefault 48:\n", err);
            await request.reply(lg.error.undefinedError);
        }
        return;
    }

    if (args[1] !== 'true' && args[1] !== 'false') {
        await request.reply("Không có lựa chọn đó, chỉ có `true` hoặc `false`");
        return;
    }

    try {
        if (find) {
            await databaseManager.updateMember(memberId, {
                tarot: args[1]
            });
        } else {
            await databaseManager.newMember(memberId, {
                tarot: args[1]
            });
        }

        embed.setTitle(lg.main.successExecution);
        embed.setDescription(`Đã đặt áp dụng cả lá bài ngược khi bốc bài Tarot thành **${args[1]}**`);
        await request.reply({ embeds: [embed] });;
    } catch (error) {
        console.log("tarotdefault 74:\n", error);
        await request.reply(lg.error.undefinedError);
    }
}

module.exports.run = run;

module.exports.help = help;