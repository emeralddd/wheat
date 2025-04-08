const bot = require('wheat-better-cmd');
const { SlashCommandBuilder } = require('discord.js');
const databaseManager = require('../../modules/databaseManager');
const { Request } = require('../../structure/Request');
const { languageList } = require('../../modules/languageBase');
require('dotenv').config({ path: 'secret.env' });

const help = {
    name: "selflanguage",
    group: "setting",
    aliases: ["selflang", "ngonngurieng", "nnr", "sl"],
    rate: 2000,
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('language')
                .setDescription('choose self language')
                .setDescriptionLocalization('vi', 'chọn ngôn ngữ riêng')
                .addChoices(
                    { name: 'Tiếng Việt', value: 'vi' },
                    { name: 'English', value: 'en' },
                    { name: 'Không sử dụng/Unset', value: 'unset' }
                )
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, t, serverInfo }) => {
    const embed = bot.wheatSampleEmbedGenerate();
    const memberId = request.member.id;
    const find = await databaseManager.getMember(memberId);

    if (request.isInteraction) {
        args = [''];
        if (request.interaction.options.getString('language')) {
            args.push(request.interaction.options.getString('language'));
        }
    }

    if (!args[1]) {
        try {
            if (!find.language) {
                embed.setDescription(t('main.myLanguage', { lang: t('main.unset') }));
            } else {
                embed.setDescription(t('main.myLanguage', { lang: find.language }));
            }

            await request.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            await request.reply(t('error.undefinedError'));
        }
        return;
    }

    if (args[1] !== 'unset' && !languageList.includes(args[1])) {
        return request.reply(t('error.wrongLanguage', { langList: languageList.join(', ') }));
    }

    try {
        if (find.id) {
            await databaseManager.updateMember(memberId, {
                language: args[1]
            });
        } else {
            await databaseManager.newMember(memberId, {
                language: args[1]
            });
        }

        let afterLang = args[1];
        if (args[1] === 'unset') {
            afterLang = serverInfo.language;
            args[1] = t('main.unset', {}, serverInfo.language);
        }

        embed.setTitle(t('main.successExecution', {}, afterLang));
        embed.setDescription(t('main.changeSelfLanguageTo', { lang: args[1] }), afterLang);
        await request.reply({ embeds: [embed] });
    } catch (error) {
        console.log(error);
        await request.reply(t('error.undefinedError'));
    }
}

module.exports.run = run;

module.exports.help = help;