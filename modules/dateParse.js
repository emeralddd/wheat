module.exports.dateInput = (request, message, sep, options) => {
    const dateInput = request.isMessage ? message.split(sep) : null;

    const res = [];

    options.forEach((o, index) => {
        res.push(request.isMessage ? Number(dateInput[index]) : request.interaction.options.getInteger(o))
    });

    return res;
}

module.exports.convertTo2DigitNumber = (n) => {
    return (n < 10 ? "0" : "") + n;
}