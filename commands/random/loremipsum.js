const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')
const LoremIpsum = require("lorem-ipsum").LoremIpsum

const help = {
    name:"loremipsum",
    htu:"",
    des:"Tạo ra một đoạn Dummy Text ngẫu nhiên",
    group:"random",
    aliases: ["li","lorem","ipsum","dummy"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message}) => {
    const lorem = new LoremIpsum({
        sentencesPerParagraph: {
          max: 8,
          min: 4
        },
        wordsPerSentence: {
          max: 16,
          min: 4
        }
    })
    const loremstring = lorem.generateParagraphs(1)
    await bot.wheatSend(message,loremstring)
}

module.exports.run = run

module.exports.help = help