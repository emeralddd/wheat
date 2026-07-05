// const { ShardingManager } = require('discord.js');
const { ClusterManager } = require('discord-hybrid-sharding');

require('dotenv').config({ path: 'secret.env' });

const manager = new ClusterManager('./mainbot.js', {
    totalShards: (process.env.NODE_ENV === 'dev' ? 2 : Number(process.env.shards)),
    shardsPerClusters: (process.env.NODE_ENV === 'dev' ? 2 : Number(process.env.shardsPerCluster)),
    mode: 'process',
    respawn: true,
});

manager.on('clusterCreate', cluster => {
    console.log(`Cluster ${cluster.id} sinh thanh cong!`);

    cluster.on('disconnect', (a) => {
        console.log(`Cluster ${cluster.id} disconnected`);
    });
    cluster.on('reconnecting', (a) => {
        console.log(`Cluster ${cluster.id} reconnecting`);
    });
    cluster.on('death', (a) => {
        console.log(`Cluster ${cluster.id} died`);
    });
});

manager.spawn({
    timeout: -1
});
