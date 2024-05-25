const bot = require('wheat-better-cmd');
const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment');
const { Request } = require('../../structure/Request');

const help = {
    name: "rtime",
    group: "random",
    aliases: ["randomtime", "ngaunhiengio", "timebetween"],
    data: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName('default')
                .setDescription('random from 00:00 to 23:59')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('1option')
                .setDescription('random from 00:00 to time chosen')
                .addStringOption(option =>
                    option.setName('lasttime')
                        .setDescription('<hh:mm>, from 00:00 to 23:59')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('2options')
                .setDescription('random from first time to last time')
                .addStringOption(option =>
                    option.setName('firsttime')
                        .setDescription('<hh:mm>, from 00:00 to 23:59')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('lasttime')
                        .setDescription('<hh:mm>, from 00:00 to 23:59')
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
            last = Date.now();
        } else if (args.length === 2) {
            first = moment(`00:00 05/01/1970`, 'HH:mm DD/MM/YYYY', true).unix();
            last = moment(`${args[1]} 05/01/1970`, 'HH:mm DD/MM/YYYY', true).unix();
        } else if (args.length === 3) {
            first = moment(`${args[1]} 05/01/1970`, 'HH:mm DD/MM/YYYY', true).unix();
            last = moment(`${args[2]} 05/01/1970`, 'HH:mm DD/MM/YYYY', true).unix();
        } else {
            await request.reply(lg.error.formatError);
            return;
        }
    } else {
        const subcommand = request.interaction.options.getSubcommand(false);

        if (subcommand === 'default') {
            first = 0;
            last = Date.now();
        }
        if (subcommand === '1option') {
            first = moment(`00:00 05/01/1970`, 'HH:mm DD/MM/YYYY', true).unix();
            last = moment(`${request.interaction.options.getString('lasttime')} 05/01/1970`, 'HH:mm DD/MM/YYYY', true).unix();
        }

        if (subcommand === '2options') {
            first = moment(`${request.interaction.options.getString('firsttime')} 05/01/1970`, 'HH:mm DD/MM/YYYY', true).unix();
            last = moment(`${request.interaction.options.getString('lasttime')} 05/01/1970`, 'HH:mm DD/MM/YYYY', true).unix();
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
    await request.reply(`${lg.random.randomTime}: ${moment.unix(choose).format("HH:mm")}`);
}

module.exports.run = run;

module.exports.help = help;