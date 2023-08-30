const bot = require('wheat-better-cmd');
require('dotenv').config({ path: 'secret.env' });
const { Message, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

const help = {
    name: "shard",
    group: "utility",
    aliases: [],
    data: new SlashCommandBuilder()
        .addNumberOption(option =>
            option.setName('shardId')
                .setDescription(`[0,${process.env.shards})`)
                .setRequired(false)
        )
};

/**
 * @param {object} obj
 * @param {String[]} obj.S
 * @param {Message} obj.message
 * @param {ChatInputCommandInteraction} obj.interaction
 */

const run = async ({ args, message, interaction, lg }) => {
    const embed = bot.wheatSampleEmbedGenerate();
}

module.exports.run = run

module.exports.help = help