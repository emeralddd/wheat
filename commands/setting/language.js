const bot = require('wheat-better-cmd')
const { PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const databaseManager = require('../../modules/databaseManager');
const { Request } = require('../../structure/Request');
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
                .addChoices(
                    { name: 'Tiếng Việt', value: 'vi_VN' },
                    { name: 'English', value: 'en_US' },
                )
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator | PermissionsBitField.Flags.ManageGuild)
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 * @param {String[]} obj.langList
 */

const run = async ({ request, args, langList, lg, language, lang }) => {
    const embed = bot.wheatSampleEmbedGenerate();

    if (request.isMessage) {
        const perm = request.member.permissions;
        if (!(perm.has(PermissionsBitField.Flags.Administrator) || perm.has(PermissionsBitField.Flags.ManageGuild))) {
            await request.reply(lg.error.missingPermission);
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
            if ((!find) || (find && !find.language)) {
                embed.setDescription(`${lg.main.languageAtThisServer}: **${process.env.CODE}**`);
            } else {
                embed.setDescription(`${lg.main.languageAtThisServer}: **${find.language}**`);
            }

            await request.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            await request.reply(lg.error.undefinedError);
        }
        return;
    }

    if (!langList.includes(args[1])) {
        await request.reply(`${lg.error.wrongLanguage} **${langList.join(', ')}**`);
        return;
    }

    try {
        if (find) {
            await databaseManager.updateServer(guildid, {
                language: args[1]
            });
        } else {
            await databaseManager.newServer(guildid, {
                language: args[1]
            });
        }

        embed.setTitle(language[args[1]].main.successExecution);
        embed.setDescription(`${language[args[1]].main.changeLanguageTo} **` + args[1] + `**`)
        await request.reply({ embeds: [embed] });
    } catch (error) {
        console.log(error);
        await request.reply(lg.error.undefinedError);
    }
}

module.exports.run = run;

module.exports.help = help;