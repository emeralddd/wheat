const { Collection, SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const { Request } = require('../../structure/Request');

const help = {
    name: "help",
    group: "utility",
    aliases: [],
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('option')
                .setDescription('command/group command')
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

const run = async ({ request, args, helpMenu, groupMenu, prefix, aliasesList, language, lang }) => {

    const lg = language[lang];
    const embed = bot.wheatSampleEmbedGenerate(true);
    embed.setAuthor({ name: `Wheat#1261`, iconUrl: process.env.AVATAR });

    if ((args && args.length === 1) || (request.isInteraction && (!request.interaction.options.getString('option')))) {
        embed.setTitle(lg.help.listCommand);
        embed.setDescription(lg.help.note2 + '`' + prefix + lg.help.note3 + '\n**' + lg.help.note4 + 'https://discord.gg/z5Z4uzmED9**');
        embed.addFields(
            {
                name: language[lang].help.astronomy,
                value: '`' + groupMenu['astronomy'].join('` `') + '`'
            },
            {
                name: language[lang].help.fortuneTelling,
                value: '`' + groupMenu['ftelling'].join('` `') + '`'
            },
            {
                name: language[lang].help.random,
                value: '`' + groupMenu['random'].join('` `') + '`'
            },
            {
                name: language[lang].help.fun,
                value: '`' + groupMenu['fun'].join('` `') + '`'
            },
            {
                name: language[lang].help.utility,
                value: '`' + groupMenu['utility'].join('` `') + '`'
            },
            {
                name: language[lang].help.setting,
                value: '`' + groupMenu['setting'].join('` `') + '`'
            }
        );
        await request.reply({ embeds: [embed] });
        return;
    }

    let list = "", command;
    command = (args ? args[1] : request.interaction.options.getString('option').trim()).toLowerCase();

    if (groupMenu[command]) {
        if (command === 'admin') return;
        for (const id of groupMenu[command]) {
            list += " `" + id + "`";
        }
        embed.setTitle(`${lg.help.groupCommand}: ${command}`);
        embed.setDescription(list);

        await request.reply({ embeds: [embed] });
        return;
    }

    if (aliasesList.has(command)) command = aliasesList.get(command);
    if (helpMenu[command]) {
        for (const id of helpMenu[command].aliases) {
            list += " `" + id + "`";
        }

        if (list === "") list = lg.help.none;
        if (helpMenu[command].group === '') return;

        embed.setTitle(`${lg.help.command}: ${command}`);
        embed.addFields(
            {
                name: lg.help.parentGroup,
                value: "`" + helpMenu[command].group + "`",
            },
            {
                name: lg.help.aliases,
                value: list,
            },
            {
                name: lg.help.syntax,
                value: "`" + prefix + command + helpMenu[command].syntax[lang] + "`\n" + helpMenu[command].note[lang],
            },
            {
                name: lg.help.example,
                value: helpMenu[command].example?.map(e => `\`${prefix}${command}${e}\``).join('\n') ?? `\`${prefix}${command}\``
            },
            {
                name: lg.help.ratelimit,
                value: `${helpMenu[command].rate ? helpMenu[command].rate / 1000 : 0}s`,
            }
        );

        if (helpMenu[command].desc[lang] === "") {
            console.log(command);
            return;
        }

        if (helpMenu[command].desc[lang][0] === ' ') console.log(command);

        embed.setDescription(helpMenu[command].desc[lang]);
        embed.setFooter({ text: lg.help.note1 });

        await request.reply({ embeds: [embed] });
    } else {
        await request.reply(lg.help.noCommand);
    }
}

module.exports.run = run;

module.exports.help = help;