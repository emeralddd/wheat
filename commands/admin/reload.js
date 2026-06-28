const { Client } = require('discord.js');
const bot = require('wheat-better-cmd');
const { Request } = require('../../structure/Request');
const announcementManager = require('../../modules/announcementManager');
const path = require('path');

/**
 * @param {object} obj
 * @param {Request} obj.request
 * @param {Client} obj.wheat
 * @param {String[]} obj.args
 */

module.exports.run = async ({ wheat , request }) => {
    if (request.author.id !== '687301490238554160') return;

    const announcementModulePath = path.join(__dirname, '../../modules/announcementManager.js');

    wheat.shard.broadcastEval(async (c, { announcementModulePath }) => {
        try {
            const announcementManager = require(announcementModulePath);
            await announcementManager.reloadAnnouncementData();
        } catch (error) {
            console.error('Error reloading announcement data:', error);
        }
    }, { context: { announcementModulePath } });
}

module.exports.help = {
    name: "reload",
    htu: "",
    des: "",
    group: "",
    aliases: []
}
