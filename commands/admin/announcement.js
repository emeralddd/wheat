const { Client } = require('discord.js');
const fs = require('fs');
const bot = require('wheat-better-cmd');
const { Request } = require('../../structure/Request');

/**
 * @param {object} obj
 * @param {Client} obj.wheat
 * @param {Request} obj.request
 * @param {String[]} obj.args
 */

module.exports.run = async ({ wheat, request, args }) => {
    if (request.author.id !== '687301490238554160') return;

    const announcement = require('../../announcement.json');

    if (args[1] === 'active') {
        announcement.status = "active";
    }

    if (args[1] === 'dev') {
        announcement.status = "dev";
    }

    if (args[1] === 'test') {
        const embed = bot.wheatSampleEmbedGenerate();
        embed.setTitle(announcement.title);
        embed.setDescription(announcement.description);
        await request.reply({ embeds: [embed] });
        return;
    }

    if (args[1] === 'title') {
        let talk = "";
        for (let i = 2; i < args.length; i++)
            talk += args[i] + " ";

        for (let i = 0; i < talk.length - 1; i++) {
            if (talk[i] === "\\" && talk[i + 1] === 'n') {
                talk = talk.split('');
                talk[i] = '';
                talk[i + 1] = '\n';
                talk = talk.join('');
            }
        }
        announcement.title = talk;
    }

    if (args[1] === 'des') {
        let talk = "";
        for (let i = 2; i < args.length; i++)
            talk += args[i] + " ";

        for (let i = 0; i < talk.length - 1; i++) {
            if (talk[i] === "\\" && talk[i + 1] === 'n') {
                talk = talk.split('');
                talk[i] = '';
                talk[i + 1] = '\n';
                talk = talk.join('');
            }
        }

        announcement.description = talk;
    }

    fs.writeFileSync('announcement.json', JSON.stringify(announcement));
}

module.exports.help = {
    name: "admin",
    htu: "",
    des: "abc",
    group: "",
    aliases: ["ann"]
}
