const { Collection, SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const { Request } = require('../../structure/Request');
const { groupList, groupMenu, aliaseHas, aliaseGet, commandGet, commandHas } = require('../../modules/commandBase');

const help = {
    name: "help",
    group: "utility",
    aliases: [],
    example: ["", " fun", " tarot"],
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('option')
                .setDescription('command/group command')
                .setDescriptionLocalization('vi', 'lệnh/nhóm lệnh')
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 * @param {Array} obj.helpMenu
 * @param {Array} obj.groupMenu
 * @param {string} obj.prefix
 * @param {Collection} obj.aliasesList
 */

const run = async ({ request, args, prefix, t }) => {
    const embed = bot.wheatSampleEmbedGenerate(true);
    embed.setAuthor({ name: `Wheat#1261`, iconURL: process.env.AVATAR });

    const language = request.language;

    if ((args && args.length === 1) || (request.isInteraction && (!request.interaction.options.getString('option')))) {
        embed.setTitle(t('help.listCommand'));
        embed.setDescription(t('help.description', { prefix }));
        embed.addFields(
            groupList.map(g => ({
                name: t(`help.${g}`),
                value: '`' + groupMenu[g].join('` `') + '`'
            }))
        );
        return request.reply({ embeds: [embed] });
    }

    let command;
    command = (args ? args[1] : request.interaction.options.getString('option').trim()).toLowerCase();

    if (groupMenu[command]) {
        if (command === 'admin') {
            return request.reply(t('help.noCommand'));
        }
        embed.setTitle(t('help.groupCommand', { group: t(`help.${command}`) }));
        embed.setDescription('`' + groupMenu[command].join('` `') + '`');

        return request.reply({ embeds: [embed] });
    }

    if (aliaseHas(command)) command = aliaseGet(command);
    if (commandHas(command)) {
        const helpCommand = commandGet(command).help;
        if (helpCommand.group === '' || helpCommand.group === 'admin') {
            return request.reply(t('help.noCommand'));
        }

        embed.setTitle(t('help.command', { command }));
        embed.addFields(
            {
                name: t('help.parentGroup'),
                value: "`" + helpCommand.group + "`",
            },
            {
                name: t('help.aliases'),
                value: helpCommand.aliases.length === 0 ? t('help.none') : helpCommand.aliases.map(a => "`" + a + "`").join(' '),
            },
            {
                name: t('help.syntax'),
                value: "`" + prefix + command + helpCommand.syntax[language] + "`\n" + helpCommand.note[language],
            },
            {
                name: t('help.example'),
                value: helpCommand.example?.map(e => `\`${prefix}${command}${e}\``).join('\n') ?? `\`${prefix}${command}\``
            },
            {
                name: t('help.ratelimit'),
                value: `${helpCommand.rate ? helpCommand.rate / 1000 : 0}s`,
            }
        );

        if (helpCommand.desc[language] === "") {
            console.log(command);
            return;
        }

        embed.setDescription(helpCommand.desc[language]);
        embed.setFooter({ text: t('help.note') });

        await request.reply({ embeds: [embed] });
    } else {
        await request.reply(t('help.noCommand'));
    }
}

module.exports.run = run;

module.exports.help = help;