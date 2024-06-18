const bot = require('wheat-better-cmd');
const { PermissionsBitField, Collection, SlashCommandBuilder } = require('discord.js');
const databaseManager = require('../../modules/databaseManager');
const { Request } = require('../../structure/Request');

const help = {
    name: "disable",
    group: "setting",
    aliases: ["ignore", "photlo", "lamlo"],
    rate: 4000,
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('options')
                .setDescription('[all/command 1/group command 1] [all/command 2/group command 2] ...')
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator | PermissionsBitField.Flags.ManageGuild)
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 * @param {String[]} obj.langList
 * @param {Collection} obj.aliasesList
 * @param {Array} obj.groupMenu
 * @param {Collection} obj.commandsList
 * @param {Array} obj.groups
 */

const run = async ({ request, args, lg, groupMenu, aliasesList, commandsList, groups }) => {
    const embed = bot.wheatSampleEmbedGenerate();

    if (request.isMessage) {
        const perm = request.member.permissions;
        if (!(perm.has(PermissionsBitField.Flags.Administrator) || perm.has(PermissionsBitField.Flags.ManageGuild))) {
            await request.reply(lg.error.missingPermission);
            return;
        }
        args.shift();
    } else {
        args = [];
        if (request.interaction.options.getString('options')) args = request.interaction.options.getString('options').split(' ');
    }

    let disabledCommands = [];

    for (let i = 0; i < args.length; i++) {
        if (args[i] === 'enable' || aliasesList.get(args[i]) === 'enable') continue;
        if (args[i] === 'all') {
            for (const g of groups) {
                for (const command of groupMenu[g]) {
                    if (command !== 'enable') disabledCommands.push(command);
                }
            }
        } else if (commandsList.has(args[i])) {
            disabledCommands.push(args[i]);
        } else if (aliasesList.has(args[i])) {
            disabledCommands.push(aliasesList.get(args[i]));
        } else if (groups.includes(args[i])) {
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

        embed.setTitle(lg.main.successExecution);

        for (const group of groups) {
            let commands = [];
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
        await request.reply(lg.error.undefinedError);
    }
}

module.exports.run = run;

module.exports.help = help;