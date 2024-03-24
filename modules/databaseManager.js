const member = require('../models/member');
const server = require('../models/server');
const getServerUserDatabase = require('./getServerUserDatabase');
let members, servers;

const init = async () => {
    members = await getServerUserDatabase.members();
    servers = await getServerUserDatabase.servers();
}

init();

module.exports.getMember = (memberId) => {
    if (members) return members[memberId];
    return {};
}

module.exports.getServer = (serverId) => {
    if (servers) return servers[serverId];
    return {};
}

module.exports.updateMember = async (memberId, newData, toDatabase) => {
    try {
        if (toDatabase) {
            await member.findOneAndUpdate(
                { id: memberId },
                newData,
                { new: true }
            );
        }

        members[memberId] = {
            ...members[memberId],
            ...newData
        };
    } catch (err) {
        throw err;
    }
}

module.exports.updateServer = async (serverId, newData) => {
    try {
        await server.findOneAndUpdate(
            { id: serverId },
            newData,
            { new: true }
        );

        servers[serverId] = {
            ...servers[serverId],
            ...newData
        };
    } catch (err) {
        throw err;
    }
}

module.exports.newMember = async (memberId, newData, toDatabase) => {
    try {
        if (toDatabase) {
            const newMember = new member({
                id: memberId,
                ...newData
            });

            await newMember.save();
        }

        members[memberId] = newData;
    } catch (err) {
        throw err;
    }
}

module.exports.newServer = async (serverId, newData) => {
    try {
        const newServer = new server({
            id: serverId,
            ...newData
        });

        await newServer.save();

        servers[serverId] = newData;
    } catch (err) {
        throw err;
    }
}