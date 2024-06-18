const bot = require('wheat-better-cmd');
const { PermissionsBitField, Collection, SlashCommandBuilder } = require('discord.js');
const databaseManager = require('../../modules/databaseManager');
const { Request } = require('../../structure/Request');

const help = {
    name: "enable",
    group: "setting",
    aliases: ["hear", "listen", "bophotlo"],
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

    let enabledCommands = [];

    for (let i = 0; i < args.length; i++) {
        if (args[i] === 'all') {
            for (const g of groups) {
                for (const command of groupMenu[g]) {
                    enabledCommands.push(command);
                }
            }
        } else if (commandsList.has(args[i])) {
            enabledCommands.push(args[i]);
        } else if (aliasesList.has(args[i])) {
            enabledCommands.push(aliasesList.get(args[i]));
        } else if (groups.includes(args[i])) {
            for (const command of groupMenu[args[i]]) {
                enabledCommands.push(command);
            }
        }
    }

    enabledCommands = new Set(enabledCommands);

    const channelId = request.channelId;

    try {
        for (const cmd of enabledCommands) {
            if (await databaseManager.getDisableCommand(channelId, cmd)) {
                await databaseManager.deleteDisableCommand(channelId, cmd);
            }
        }

        const totalDisable = await databaseManager.getDisableCommands(channelId);

        const disabledCommands = new Set();

        for (const c of totalDisable) {
            disabledCommands.add(c.command);
        }

        embed.setTitle(lg.main.successExecution);

        for (const group of groups) {
            let commands = []
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