const bot = require('wheat-better-cmd');
const { Message, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const databaseManager = require('../../modules/databaseManager');
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
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 * @param {String[]} obj.args
 */

const run = async ({ wheat, message, interaction, args, lg, language }) => {
    message ||= interaction;
    const embed = bot.wheatSampleEmbedGenerate();
    const memberId = message.member.id;
    const find = databaseManager.getMember(memberId);

    if (interaction) {
        args = [''];
        if (interaction.options.getBoolean('option') !== null) {
            args.push(interaction.options.getBoolean('option') ? 'true' : 'false');
        }
    }

    if (!args[1]) {
        try {
            if ((!find) || (find && !find.tarotReverseDefault)) {
                embed.setDescription(`Áp dụng cả lá bài ngược khi bốc bài Tarot: **Không**`);
            } else {
                embed.setDescription(`Áp dụng cả lá bài ngược khi bốc bài Tarot: **${find.tarotReverseDefault ? `Có` : `Không`}**`);
            }

            await bot.wheatEmbedSend(message, [embed]);
        } catch (err) {
            console.log("tarotdefault 48:\n", err);
            await bot.wheatSendErrorMessage(message, lg.error.undefinedError);
        }
        return;
    }

    if (args[1] !== 'true' && args[1] !== 'false') {
        await bot.wheatSendErrorMessage(message, "Không có lựa chọn đó, chỉ có `true` hoặc `false`");
        return;
    }

    try {
        if (find) {
            const fnc = eval(`async(sub) => {
                const databaseManager = require('../../../../modules/databaseManager');
                await databaseManager.updateMember('${memberId}',{tarotReverseDefault:${(args[1] === 'true')}},sub.shard.ids[0]===${wheat.shard.ids[0]});
            }`);

            await wheat.shard.broadcastEval(fnc);
        } else {
            const fnc = eval(`async(sub) => {
                const databaseManager = require('../../../../modules/databaseManager');
                await databaseManager.newMember('${memberId}',{tarotReverseDefault:${(args[1] === 'true')}},sub.shard.ids[0]===${wheat.shard.ids[0]});
            }`);

            await wheat.shard.broadcastEval(fnc);
        }

        embed.setTitle(lg.main.successExecution);
        embed.setDescription(`Đã đặt áp dụng cả lá bài ngược khi bốc bài Tarot thành **${args[1]}**`);
        await bot.wheatEmbedSend(message, [embed]);
    } catch (error) {
        console.log("tarotdefault 74:\n", error);
        await bot.wheatSendErrorMessage(message, lg.error.undefinedError);
    }
}

module.exports.run = run;

module.exports.help = help;