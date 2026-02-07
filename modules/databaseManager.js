require('dotenv').config({ path: 'secret.env' });
const sqlite3 = require('sqlite3').verbose();
let db;

module.exports.connect = () => {
    db = new sqlite3.Database(__dirname + `/../database/${process.env.DBFILE}`, (error) => {
        if (error) {
            return console.error(error.message);
        }

        return console.log('DB Connected Successfully!');
    });
}

const queryWithoutRow = (query, values) => {
    return new Promise((resolve, reject) => {
        db.run(query, values,
            function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve(1);
                }
            }
        );
    });
}

const querySingleRow = (query, values) => {
    return new Promise((resolve, reject) => {
        db.get(query, values,
            function (error, row) {
                if (error) {
                    reject(error);
                } else {
                    resolve(row);
                }
            }
        );
    });
}

const queryMultipleRows = (query, values) => {
    return new Promise((resolve, reject) => {
        db.all(query, values,
            function (error, row) {
                if (error) {
                    reject(error);
                } else {
                    resolve(row);
                }
            }
        );
    });
}

module.exports.getMember = async (memberId) => {
    try {
        const res = await querySingleRow(`select * from member where id = ?`, 
            [String(memberId)]);
        return res || {};
    } catch (err) {
        throw err;
    }
}

module.exports.getServer = async (serverId) => {
    try {
        const res = await querySingleRow(`select * from server where id = ?`, 
            [String(serverId)]);
        return res || {};
    } catch (err) {
        throw err;
    }
}

module.exports.updateMember = async (memberId, newData) => {
    try {
        const values = [];
        const setList = [];
        for (const [key, value] of Object.entries(newData)) {
            setList.push(key + '= ?');
            values.push(value === 'unset' ? null : value);
        }

        queryWithoutRow(`update member set ${setList.join(',')} where id = ?`, 
            [...values, String(memberId)]);
    } catch (err) {
        throw err;
    }
}

module.exports.updateServer = async (serverId, newData) => {
    try {
        const setList = [];
        const values = [];
        for (const [key, value] of Object.entries(newData)) {
            setList.push(key + '= ?');
            values.push(value);
        }

        queryWithoutRow(`update server set ${setList.join(',')} where id = ?`, 
            [...values, String(serverId)]);
    } catch (err) {
        throw err;
    }
}

module.exports.newMember = async (memberId, newData) => {
    try {
        queryWithoutRow(`insert into member values(?, ?, ?, ?, ?, ?)`, 
            [memberId, newData.verify ? 1 : 0, newData.premium ? 1 : 0, newData.language && newData.language !== 'unset' ? newData.language : null, newData.tarot ? 1 : 0, newData.hideTarotMeaning ? 1 : 0]);
    } catch (err) {
        throw err;
    }
}

module.exports.newServer = async (serverId, newData) => {
    try {
        queryWithoutRow(`insert into server values(?, ?, ? ,?)`, 
            [serverId, newData.premium ? 1 : 0, newData.prefix || 'e', newData.language || 'vi']);
    } catch (err) {
        throw err;
    }
}

module.exports.getDisableCommand = async (channelId, cmd) => {
    try {
        const res = await querySingleRow(`select * from disable where channelId = ? and command = ?`, 
            [channelId, cmd]);
        return (res ? 1 : 0);
    } catch (err) {
        throw err;
    }
}

module.exports.getDisableCommands = async (channelId) => {
    try {
        const res = await queryMultipleRows(`select command from disable where channelId=?`, 
            [channelId]);
        return res;
    } catch (err) {
        throw err;
    }
}

module.exports.newDisableCommand = async (channelId, cmd) => {
    try {
        await queryWithoutRow(`insert into disable values(?, ?)`, 
            [channelId, cmd]);
    } catch (err) {
        throw err;
    }
}

module.exports.deleteDisableCommand = async (channelId, cmd) => {
    try {
        await queryWithoutRow(`delete from disable where channelId= ? and command= ?`, 
            [channelId, cmd]);
    } catch (err) {
        throw err;
    }
}

module.exports.logRequest = async (serverId, timestamp, command, typeOfRequest) => {
    try {
        await queryWithoutRow(`insert into statistic values(?, ?, ?, ?)`, 
            [serverId, timestamp, command, typeOfRequest]);
    } catch (err) {
        throw err;
    }
}