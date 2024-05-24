// parseString("Hi!! Hello %name%",{name:'Nam'})

module.exports = (str, opt) => {
    for (const [key, value] of Object.entries(opt)) {
        str = str.replace(`%${key}%`, value);
    }
    return str;
}