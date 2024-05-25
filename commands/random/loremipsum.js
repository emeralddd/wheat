const { Request } = require("../../structure/Request");
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const help = {
  name: "loremipsum",
  group: "random",
  aliases: ["li", "lorem", "ipsum", "dummy"]
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 */

const run = async ({ request }) => {

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4
    },
    wordsPerSentence: {
      max: 16,
      min: 4
    }
  });

  const loremstring = lorem.generateParagraphs(1);
  await request.reply(loremstring);
}

module.exports.run = run;

module.exports.help = help;