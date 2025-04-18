const mongo = require('mongoose');
const member = require('../models/member');
const server = require('../models/server');
require('dotenv').config({ path: 'secret.env' });
const sqlite3 = require('sqlite3').verbose();
let db;

const connectMongoDB = async () => {
    try {
        mongo.set("strictQuery", false);
        mongo.connect(process.env.DBURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }, () => {
            console.log('DB Connected Successfully!');
        });
    } catch (err) {
        if (err) {
            console.log(err.message);
            process.exit(1);
        }
    }
}

const connectSQLite = async () => {
    db = new sqlite3.Database(__dirname + `/../database/${process.env.DBFILE}`, (error) => {
        if (error) {
            return console.error(error.message);
        }

        return console.log('Hi!');
    });
}

const queryDB = (query) => {
    return new Promise((resolve, reject) => {
        db.run(query,
            function (error) {
                if (error) {
                    console.error(error);
                    reject(0);
                } else {
                    resolve(1);
                }
            }
        );
    });
}

const getMembers = async () => {
    await queryDB('delete from member');
    const members = await member.find();
    let cnt = 0;
    for (const i of members) {
        const query = `insert into member values ("${i.id}",${i.verify ? 1 : 0},${i.premium ? 1 : 0},${i.language && i.language !== 'unset' ? "\"" + i.language + "\"" : "null"},${i.tarotReverseDefault ? 1 : 0})`;
        cnt += await queryDB(query);
    }

    console.log('get members ', cnt);
}

const getServers = async () => {
    await queryDB('delete from server');
    await queryDB('delete from disable');
    const servers = await server.find();
    const s = {};
    let cnt = 0, cnt1 = 0;
    for (const i of servers) {
        if (s[i.id]) continue;
        s[i.id] = true;

        if (!i.prefix || i.prefix.length === 0) i.prefix = 'e';
        i.prefix = i.prefix.replace(`"`, `""`);

        const query = `insert into server values ("${i.id}",${i.premium ? 1 : 0},"${i.prefix}","${i.language ? i.language : 'vi_VN'}")`;
        if (i.disable)
            for (const [key, val] of i.disable) {
                if (val)
                    for (const c of val) {
                        const query = `insert into disable values ("${c}","${key}")`;
                        cnt1 += await queryDB(query);
                    }
            }
        cnt += await queryDB(query);
    }

    console.log('get servers ', cnt);
    console.log('get disable ', cnt1);
}

const fixStatistic = async () => {
    await queryDB("drop table statistic");
    await queryDB("CREATE TABLE statistic (serverId      TEXT, timestamp     INTEGER, command       TEXT, typeOfRequest INTEGER);");
}

const fixLanguage = async () => {
    await queryDB("update member set language='vi' where language='vi_VN'");
    await queryDB("update server set language='vi' where language='vi_VN'");
    await queryDB("update member set language='en' where language='en_US'");
    await queryDB("update server set language='en' where language='en_US'");
}

const start = async () => {
    // connectMongoDB();
    connectSQLite();

    fixLanguage();
    // fixStatistic();
    // getMembers();
    // getServers();
}

start();