const { ShardingManager } = require('discord.js');
require('dotenv').config({ path: 'secret.env' });

const manager = new ShardingManager('./mainbot.js', {
    totalShards: (process.env.NODE_ENV === 'dev' ? 2 : Number(process.env.shards)),
    respawn: true
});

manager.on('shardCreate', shard => {
    console.log(`Shard ${shard.id} sinh thanh cong!`);

    shard.on('disconnect', (a) => {
        console.log(`Shard ${shard.id} disconnected`);
    });
    shard.on('reconnecting', (a) => {
        console.log(`Shard ${shard.id} reconnecting`);
    });
    shard.on('death', (a) => {
        console.log(`Shard ${shard.id} died`);
    });
});

manager.spawn({
    timeout: -1
});
