require('dotenv').config()

if(process.env.NODE_ENV !== 'dev') {
    const express = require('express')
    const app = express()

    app.get('/', function (req, res) {
        res.send('Hello World')
    })

    app.use(express.static('public'))

    app.listen(3000)
}

const {ShardingManager} = require('discord.js')
require('dotenv').config()

const manager = new ShardingManager('./mainbot.js', { totalShards: (process.env.NODE_ENV === 'dev'?1:5), token: process.env.TOKEN })

manager.on('shardCreate', shard => console.log(`Shard ${shard.id} sinh thanh cong!`))

manager.spawn()
