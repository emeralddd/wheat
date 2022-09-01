require('dotenv').config({path: 'secret.env'})

if(process.env.NODE_ENV !== 'dev') {
    const express = require('express')
    const app = express()

    app.get('/', function (req, res) {
        res.send('Hello World')
    })

    app.listen(8000)
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
