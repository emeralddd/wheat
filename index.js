const { ShardingManager } = require('discord.js');
require('dotenv').config({ path: 'secret.env' });

const manager = new ShardingManager('./mainbot.js', {
    totalShards: (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test' ? 1 : Number(process.env.shards)),
    respawn: true
});

manager.on('shardCreate', shard => {
    console.log(`Shard ${shard.id} sinh thanh cong!`);

    shard.on('disconnect', (a) => {
        console.log(`Shard ${shard.id} disconnected`);
        console.log(a);
    });
    shard.on('reconnecting', (a) => {
        console.log(`Shard ${shard.id} reconnecting`);
        console.log(a);
    });
    shard.on('death', (a) => {
        console.log(`Shard ${shard.id} died`);
        console.log(process.memoryUsage());
        console.log(a);
    });
});

manager.spawn({
    timeout: -1
});
