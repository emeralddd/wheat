const bot = require('wheat-better-cmd');
const { SlashCommandBuilder } = require('discord.js');
const databaseManager = require('../../modules/databaseManager');
const { Request } = require('../../structure/Request');
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
                .addChoices(
                    { name: 'Tiếng Việt', value: 'vi_VN' },
                    { name: 'English', value: 'en_US' },
                )
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 * @param {String[]} obj.langList
 */

const run = async ({ wheat, request, args, langList, lg, language }) => {
    const embed = bot.wheatSampleEmbedGenerate();
    const memberId = request.member.id;
    const find = databaseManager.getMember(memberId);

    if (request.isInteraction) {
        args = [''];
        if (request.interaction.options.getString('language')) {
            args.push(request.interaction.options.getString('language'));
        }
    }

    if (!args[1]) {
        try {
            if ((!find) || (find && !find.language)) {
                embed.setDescription(`${lg.main.myLanguage}: **${lg.main.unset}**`);
            } else {
                embed.setDescription(`${lg.main.myLanguage}: **${find.language}**`);
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
            const fnc = eval(`async(sub) => {
                const databaseManager = require('../../../../modules/databaseManager');
                await databaseManager.updateMember('${memberId}',{language:'${args[1]}'},sub.shard.ids[0]===${wheat.shard.ids[0]});
            }`);

            await wheat.shard.broadcastEval(fnc);
        } else {
            const fnc = eval(`async(sub) => {
                const databaseManager = require('../../../../modules/databaseManager');
                await databaseManager.newMember('${memberId}',{language:'${args[1]}'},sub.shard.ids[0]===${wheat.shard.ids[0]});
            }`);

            await wheat.shard.broadcastEval(fnc);
        }

        embed.setTitle(language[args[1]].main.successExecution);
        embed.setDescription(`${language[args[1]].main.changeSelfLanguageTo} **` + args[1] + `**`);
        await request.reply({ embeds: [embed] });
    } catch (error) {
        console.log(error);
        await request.reply(lg.error.undefinedError);
    }
}

module.exports.run = run;

module.exports.help = help;