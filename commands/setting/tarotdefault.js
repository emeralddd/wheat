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
                .setDescriptionLocalization('vi', 'bạn có muốn mặc định bốc cả bài ngược?')
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, t }) => {
    const embed = bot.wheatSampleEmbedGenerate();
    const memberId = request.member.id;
    const find = await databaseManager.getMember(memberId);

    if (request.isInteraction) {
        args = [''];
        if (request.interaction.options.getBoolean('option') !== null) {
            args.push(request.interaction.options.getBoolean('option') ? 'true' : 'false');
        }
    }

    if (!args[1]) {
        try {
            if (!find.tarot) {
                embed.setDescription(t('main.applyTarotReversed', { opt: t('main.no') }));
            } else {
                embed.setDescription(t('main.applyTarotReversed', { opt: t(`main.${find.tarot ? 'yes' : 'no'}`) }));
            }

            await request.reply({ embeds: [embed] });
        } catch (err) {
            console.log("tarotdefault 48:\n", err);
            await request.reply(t('error.undefinedError'));
        }
        return;
    }

    if (args[1] !== 'true' && args[1] !== 'false') {
        return request.reply(t('error.wrongYesNo'));
    }

    try {
        if (find.id) {
            await databaseManager.updateMember(memberId, {
                tarot: args[1] === 'true' ? 1 : 0
            });
        } else {
            await databaseManager.newMember(memberId, {
                tarot: args[1] === 'true' ? 1 : 0
            });
        }

        embed.setTitle(t('main.successExecution'));
        embed.setDescription(t('main.appliedTarotReversed', { opt: args[1] }));
        await request.reply({ embeds: [embed] });;
    } catch (error) {
        console.log("tarotdefault 74:\n", error);
        await request.reply(t('error.undefinedError'));
    }
}

module.exports.run = run;

module.exports.help = help;