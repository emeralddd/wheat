const { SnowflakeUtil } = require("discord.js");
const NodeCache = require("node-cache");
const wheatCache = new NodeCache();

const TIME_LIMIT = 15;

module.exports.get = (id) => {
    if (wheatCache.has(id)) {
        return wheatCache.get(id);
    }
    return null;
}

module.exports.set = (data) => {
    const id = SnowflakeUtil.generate().toString();
    wheatCache.set(id, data, TIME_LIMIT * 60);
    return id;
}