const {ShardingManager} = require('discord.js')
require('dotenv').config()

const manager = new ShardingManager('./mainbot.js', { totalShards: 2, token: process.env.TOKEN })

manager.on('shardCreate', shard => console.log(`Shard ${shard.id} sinh thanh cong!`))

manager.spawn()
