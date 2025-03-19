const { Request } = require("../../structure/Request");

const help = {
    name: "coinflip",
    group: "random",
    aliases: ["cf", "coin", "flip", "xu", "lat", "latdongxu", "latxu"]
}

/**
 * @param {object} obj
 * @param {Request} obj.request
 */

const run = async ({ request, lg }) => {
    const randomCoinFlipSeed = 1310;
    const cf = Math.floor(Math.random() * randomCoinFlipSeed);
    await request.reply('<a:coinfliping:1351788533999996949> ' + lg.random.flipping);
    setTimeout(() => {
        request.edit(`${((cf & 1) ? '<:head:1351788558008188961> ' + lg.random.heads : '<:tail:1351788577121636353> ' + lg.random.tails)}!`);
    }, 2000);
}

module.exports.run = run;

module.exports.help = help;