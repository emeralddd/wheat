const bot = require('wheat-better-cmd')
const { PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const databaseManager = require('../../modules/databaseManager');
const { Request } = require('../../structure/Request');
const { languageList } = require('../../modules/languageBase');
require('dotenv').config({ path: 'secret.env' });

const help = {
    name: "language",
    group: "setting",
    aliases: ["lang", "ngonngu"],
    rate: 3000,
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('language')
                .setDescription('choose language')
                .setDescriptionLocalization('vi', 'chọn ngôn ngữ')
                .addChoices(
                    { name: 'Tiếng Việt', value: 'vi' },
                    { name: 'English', value: 'en' },
                )
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator | PermissionsBitField.Flags.ManageGuild)
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, t }) => {
    const embed = bot.wheatSampleEmbedGenerate();

    if (request.isMessage) {
        const perm = request.member.permissions;
        if (!(perm.has(PermissionsBitField.Flags.Administrator) || perm.has(PermissionsBitField.Flags.ManageGuild))) {
            await request.reply(t('error.missingPermission'));
            return;
        }
    } else {
        args = [''];
        if (request.interaction.options.getString('language')) args.push(request.interaction.options.getString('language'));
    }

    const guildid = request.guildId;

    const find = await databaseManager.getServer(guildid);

    if (!args[1]) {
        try {
            if (!find.language) {
                embed.setDescription(t('main.languageAtThisServer', { lang: process.env.CODE }));
            } else {
                embed.setDescription(t('main.languageAtThisServer', { lang: find.language }));
            }

            await request.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            await request.reply(t('error.undefinedError'));
        }
        return;
    }

    if (!languageList.includes(args[1])) {
        return request.reply(t('error.wrongLanguage', { langList: languageList.join(', ') }));
    }

    try {
        if (find.id) {
            await databaseManager.updateServer(guildid, {
                language: args[1]
            });
        } else {
            await databaseManager.newServer(guildid, {
                language: args[1]
            });
        }

        embed.setTitle(t('main.successExecution', {}, args[1]));
        embed.setDescription(t('main.changeLanguageTo', { lang: args[1] }, args[1]));
        await request.reply({ embeds: [embed] });
    } catch (error) {
        console.log(error);
        await request.reply(t('error.undefinedError'));
    }
}

module.exports.run = run;

module.exports.help = help;