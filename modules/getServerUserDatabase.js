module.exports.members = async () => {
    const members = require('../models/member')
    const foundMembers = await members.find()
    let res = []
    for(const i of foundMembers) {
        res[i.id]={
            language: i.language || 'vi_VN',
        }
    }
    
    return res
}

module.exports.servers = async () => {
    const servers = require('../models/server')
    const foundServers = await servers.find()
    let res = []
    for(const i of foundServers) {
        res[i.id]={
            premium: i.premium || false,
            prefix: i.prefix || 'e',
            language: i.language || 'vi_VN',
            disable: i.disable || {}
        }
    }
    
    return res
}