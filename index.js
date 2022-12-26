require('dotenv').config({path: 'secret.env'})
const shelljs = require('shelljs');

if(process.env.NODE_ENV !== 'dev') {
    const express = require('express')
    const app = express()

    app.use(express.json())

    app.get('/', function (req, res) {
        res.send('Hello World')
    })

    app.post('/wheatriped', function (req, res) {
        if(req.body.RESTART_KEY===process.env.RESTART_KEY) {
            shelljs.exec('/restart.sh');
        }

        res.send('Hiii!');
    })

    app.listen(process.env.PORT || 8000)
}

const {ShardingManager} = require('discord.js')
require('dotenv').config({path: 'secret.env'})

const manager = new ShardingManager('./mainbot.js', { 
    totalShards: (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test'?1:Number(process.env.shards)), 
    respawn: true
})

manager.on('shardCreate', shard => console.log(`Shard ${shard.id} sinh thanh cong!`))

manager.spawn({
    timeout:-1
})
