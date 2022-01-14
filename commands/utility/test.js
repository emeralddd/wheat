const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')
const axios = require('axios').default
require('dotenv').config

const help = {
    name:"test",
    htu:"",
    des:"Gif thể hiện cảm xúc & hành động",
    group:"fun",
    aliases: []
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message,args}) => {
    const need=args[1]
    console.log(args[1])
    const res = await axios.get(`https://g.tenor.com/v1/search?q=${need}&key=${process.env.TENOR_KEY}&media_filter=minimal&contentfilter=high&pos=1&limit=40`)
    const res1 = await axios.get(`https://g.tenor.com/v1/search?q=${need}&key=${process.env.TENOR_KEY}&media_filter=minimal&contentfilter=high&pos=40&limit=40`)

    let arr=[]
    for(let i=0; i<40; i++) {
        const r=(res.data.results[i].media[0].gif.size<=3000000?res.data.results[i].media[0].gif.url:res.data.results[i].media[0].tinygif.url)
        const r1=(res1.data.results[i].media[0].gif.size<=3000000?res1.data.results[i].media[0].gif.url:res1.data.results[i].media[0].tinygif.url)

        //message.channel.send(r)
        //message.channel.send(r1)

        arr.push(r)
        arr.push(r1)
    }
    console.log(arr)
}

module.exports.run = run

module.exports.help = help