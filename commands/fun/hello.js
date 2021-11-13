const { Message } = require('discord.js')
const bot = require('wheat-better-cmd')

const help = {
    name:"hello",
    htu:"",
    des:"Đáp lại câu xin chào bằng nhiều thứ tiếng khác nhau",
    group:"fun",
    aliases: ["swasdi","hi","xinchao","hallo","aloha","conichiwa","salam","privet","nihao"]
}

/**
 * @param {object} obj
 * @param {Message} obj.message
 */

const run = async ({message}) => {
    const list=["مرحبا ", "Përshëndetje", "እው ሰላም ነው", "Hello!", "Բարեւ", "Salam", "cześć", "سلام" , "Mholweni", 
    "Kaixo", "добры дзень", "হ্যালো", "zdravo", "Olá", "Здравейте", "Hola", "Kumusta", "Moni", "Bonghjornu", "Bonjou", 
    "שלום","Hej","Hallo","Tere", "Kamusta", "Hoi", "Halò", "Ola", "გამარჯობა", "નમસ્તે", "안녕하세요", "Barka dai",
    "aloha", "नमस्ते", "Nyob zoo", "Helló", "γεια", "Halló", "Nnọọ", "Halo", "Dia dhuit", "ಹಲೋ", "Сәлеметсіз бе", 
    "សួស្តី", "Mwaramutse", "slav", "салам", "ສະບາຍດີ", "Salve", "Sveiki", "Helo", "Здраво", "Salama", "ഹലോ", "Bongu",
    "Kia ora", "नमस्कार", "Сайн уу", "ဟယ်လို", "Привет","こんにちは","ନମସ୍କାର","سلام","Bonjour","Hei","ਸਤ ਸ੍ਰੀ ਅਕਾਲ","Saluton",
    "Buna ziua","talofa","Ahoj","Lumela","mhoro","هيلو","ආයුබෝවන්","Ahoj","Waad salaaman tihiin","Салом","வணக்கம்",
    "Сәлам","హలో","สวัสดี","Merhaba","你好","Здравствуйте","ہیلو","ياخشىمۇسىز","Salom","Xin chào!","Helo","Ciao",
    "העלא","Pẹlẹ o","Sawubona","Hi!"]
    await bot.wheatSend(message,list[Math.floor(Math.random()*list.length)])
}

module.exports.run = run

module.exports.help = help