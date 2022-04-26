module.exports = (langList) => {
    let language = []

    for(const i of langList) {
        language[i] = {}
        // if(i==='en_US') continue
        language[i].help = require(`../assets/language/${i}/help.json`)
        language[i].main = require(`../assets/language/${i}/main.json`)
        language[i].error = require(`../assets/language/${i}/error.json`)
        language[i].fortune = require(`../assets/language/${i}/fortune.json`)
        language[i].fun = require(`../assets/language/${i}/fun.json`)
        language[i].random = require(`../assets/language/${i}/random.json`)
    }

    return language
}