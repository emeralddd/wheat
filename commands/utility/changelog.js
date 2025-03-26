const { SlashCommandBuilder } = require('discord.js');
const bot = require('wheat-better-cmd');
const { Request } = require('../../structure/Request');

const help = {
    name: "changelog",
    group: "utility",
    aliases: ["lichsucapnhat", "lscn", "cl"],
    example: ["", " lists", " 25FifteenBA"],
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('update')
                .setDescription('lists/update name')
                .setDescriptionLocalization('vi', 'lists/tên bản cập nhật')
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, t }) => {
    const overview = require('../../logs/overview.json').logs;
    const latest = require('../../logs/overview.json').latest;
    const embed = bot.wheatSampleEmbedGenerate(true);
    let logChosen = (request.isMessage ? args[1] : request.interaction.options.getString('update')) || latest;

    logChosen.trim();

    if (logChosen === 'lists') {
        embed.setTitle(t('main.changeLog.list'));
        embed.setDescription(t('main.changeLog.latestUpdate', { latest }));
        embed.addFields([{
            name: `▼`,
            value: overview.reverse().map(v => "(#) `" + v + "`").join('\n')
        }]);
        await request.reply({ embeds: [embed] });
        return;
    }

    if (!overview.includes(logChosen)) {
        await request.reply(t('error.notFoundThatUpdate'));
        return;
    }

    const logJSON = require(`../../logs/${logChosen}.json`);

    embed.setTitle(t('main.changeLog.title'));
    embed.setDescription(t('main.changeLog.description', { logChosen, before: logJSON.before, gen: logJSON.gen, release: logJSON.release }));

    embed.addFields([
        {
            name: t('main.changeLog.add'),
            value: logJSON.add.length === 0 ? t('help.none') : logJSON.add.map(a => `(+) ${a}`).join('\n')
        },
        {
            name: t('main.changeLog.remove'),
            value: logJSON.remove.length === 0 ? t('help.none') : logJSON.remove.map(r => `(+) ${r}`).join('\n')
        }
    ]);

    await request.reply({ embeds: [embed] });
}

module.exports.run = run;

module.exports.help = help;