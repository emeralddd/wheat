const bot = require('wheat-better-cmd');
const { PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const databaseManager = require('../../modules/databaseManager');
const { Request } = require('../../structure/Request');

const help = {
    name: "prefix",
    group: "setting",
    aliases: ["pf"],
    rate: 3000,
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('prefix')
                .setDescription('length < 33')
                .setMaxLength(32)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator | PermissionsBitField.Flags.ManageGuild)
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, lg }) => {
    const embed = bot.wheatSampleEmbedGenerate();
    if (request.isMessage) {
        const perm = request.member.permissions;
        if (!(perm.has(PermissionsBitField.Flags.Administrator) || perm.has(PermissionsBitField.Flags.ManageGuild))) {
            await request.reply(lg.error.missingPermission);
            return;
        }

        if (!args[1]) {
            await request.reply(lg.error.missingNewPrefix);
            return;
        }
        if (args[1].length > 32) {
            await request.reply(lg.error.wrongPrefix);
            return;
        }
    } else {
        args = [''];
        if (request.interaction.options.getString('prefix')) args.push(request.interaction.options.getString('prefix'));
    }

    const guildid = request.guildId;

    try {
        const find = await databaseManager.getServer(guildid);

        if (find.id) {
            await databaseManager.updateServer(guildid, {
                prefix: args[1]
            });
        } else {
            await databaseManager.newServer(guildid, {
                prefix: args[1]
            });
        }

        embed.setTitle(lg.main.successExecution);
        embed.setDescription(`${lg.main.changePrefixTo} **` + args[1] + `**`);
        await request.reply({ embeds: [embed] });
    } catch (error) {
        console.log(error);
        await request.reply(lg.error.undefinedError);
    }
}

module.exports.run = run;

module.exports.help = help;