const bot = require('wheat-better-cmd');
const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment');
const { Request } = require('../../structure/Request');

const help = {
    name: "rdate",
    group: "random",
    aliases: ["randomdate", "ngaunhienngay", "datebetween"],
    data: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName('default')
                .setDescription('random from 01/01/1970 to today')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('1option')
                .setDescription('random from 01/01/1970 to last date]')
                .addStringOption(option =>
                    option.setName('lastdate')
                        .setDescription('<DD/MM/YYYY>, date after 01/01/1970')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('2options')
                .setDescription('random from first date to last date')
                .addStringOption(option =>
                    option.setName('firstdate')
                        .setDescription('<DD/MM/YYYY>, date after 01/01/1970')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('lastdate')
                        .setDescription('<DD/MM/YYYY>, date after firstdate')
                        .setRequired(true)
                )
        )
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

const run = async ({ request, args, lg }) => {
    let first, last;

    if (request.isMessage) {
        if (args.length === 1) {
            first = 0;
            last = Date.now() / 1000;
        } else if (args.length === 2) {
            first = moment('01/01/1970', 'DD/MM/YYYY', true).unix();
            last = moment(args[1], 'DD/MM/YYYY', true).unix();
        } else if (args.length === 3) {
            first = moment(args[1], 'DD/MM/YYYY', true).unix();
            last = moment(args[2], 'DD/MM/YYYY', true).unix();
        } else {
            await request.reply(lg.error.formatError);
            return;
        }
    } else {
        const subcommand = request.interaction.options.getSubcommand(false);
        if (subcommand === 'default') {
            first = 0;
            last = Date.now() / 1000;
        }

        if (subcommand === '1option') {
            first = moment('01/01/1970', 'DD/MM/YYYY', true).unix();
            last = moment(request.interaction.options.getString('lastdate'), 'DD/MM/YYYY', true).unix();
        }

        if (subcommand === '2options') {
            first = moment(request.interaction.options.getString('firstdate'), 'DD/MM/YYYY', true).unix();
            last = moment(request.interaction.options.getString('lastdate'), 'DD/MM/YYYY', true).unix();
        }
    }

    if ((!first && first != 0) || (!last && last != 0)) {
        await request.reply(lg.error.formatError);
        return;
    }

    if (first > last) {
        await request.reply(lg.error.startMustBeBeforeEnd);
        return;
    }

    const choose = bot.wheatRandomNumberBetween(first, last);
    await request.reply(`${lg.random.randomDate}: ${moment.unix(choose).format("DD/MM/YYYY")}`);
}

module.exports.run = run;

module.exports.help = help;