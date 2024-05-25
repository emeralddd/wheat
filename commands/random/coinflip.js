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
    const cf = Math.floor(Math.random() * 1310);
    await request.reply(lg.random.flipping);
    setTimeout(() => {
        request.edit(`${((cf & 1) ? lg.random.heads : lg.random.tails)}`);
    }, 2000);
}

module.exports.run = run;

module.exports.help = help;