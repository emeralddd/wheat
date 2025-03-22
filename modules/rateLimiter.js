const NodeCache = require("node-cache");
const wheatCache = new NodeCache();

let details;

module.exports.init = (data) => {
    details = data;
}

module.exports.validate = (userId, command) => {
    if (!details[command] || !details[command].rate) return 0;

    const key = userId + command;

    if (wheatCache.has(key)) {
        return details[command].rate / 1000;
    }
    wheatCache.set(key, 1, details[command].rate / 1000);
    return 0;
}