const bot = require('wheat-better-cmd');
const { PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const databaseManager = require('../../modules/databaseManager');
const { Request } = require('../../structure/Request');
const { groupList, groupMenu, aliaseGet, commandHas, aliaseHas } = require('../../modules/commandBase');

const help = {
    name: "disable",
    group: "setting",
    aliases: ["ignore", "photlo", "lamlo"],
    example: ["", " all", " fun ping"],
    rate: 4000,
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('options')
                .setDescription('[all/command 1/group command 1] [all/command 2/group command 2] ...')
                .setDescriptionLocalization('vi', '[all/lệnh 1/nhóm lệnh 1] [all/lệnh 2/nhóm lệnh 2] ...')
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
        args.shift();
    } else {
        args = [];
        if (request.interaction.options.getString('options')) args = request.interaction.options.getString('options').split(' ');
    }

    let disabledCommands = [];

    for (let i = 0; i < args.length; i++) {
        if (args[i] === 'enable' || aliaseGet(args[i]) === 'enable') continue;
        if (args[i] === 'all') {
            for (const g of groupList) {
                for (const command of groupMenu[g]) {
                    if (command !== 'enable') disabledCommands.push(command);
                }
            }
        } else if (commandHas(args[i])) {
            disabledCommands.push(args[i]);
        } else if (aliaseHas(args[i])) {
            disabledCommands.push(aliaseGet(args[i]));
        } else if (groupList.includes(args[i])) {
            for (const command of groupMenu[args[i]]) {
                if (command !== 'enable') disabledCommands.push(command);
            }
        }
    }

    disabledCommands = new Set(disabledCommands);

    const channelId = request.channelId;

    try {
        for (const cmd of disabledCommands) {
            if (!await databaseManager.getDisableCommand(channelId, cmd)) {
                await databaseManager.newDisableCommand(channelId, cmd);
            }
        }

        const totalDisable = await databaseManager.getDisableCommands(channelId);

        for (const c of totalDisable) {
            disabledCommands.add(c.command);
        }

        embed.setTitle(t('main.successExecution'));

        for (const group of groupList) {
            const commands = [];
            for (const command of groupMenu[group]) {
                if (disabledCommands.has(command)) {
                    commands.push("~~`" + command + "`~~");
                } else {
                    commands.push("**`" + command + "`**");
                }
            }

            embed.addFields({
                name: group,
                value: commands.join(" ")
            });
        }

        await request.reply({ embeds: [embed] });
    } catch (error) {
        console.log(error);
        await request.reply(t('error.undefinedError'));
    }
}

module.exports.run = run;

module.exports.help = help;