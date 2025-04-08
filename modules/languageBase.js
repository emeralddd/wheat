const i18next = require('i18next');
const viTranslation = require('../assets/language/vi/translation.json');
const enTranslation = require('../assets/language/en/translation.json');

const viHelp = require('../assets/language/vi/descriptionOfCommands.json');
const enHelp = require('../assets/language/en/descriptionOfCommands.json');

module.exports.languageList = ['vi', 'en'];
module.exports.descriptionOfCommands = {
    vi: viHelp,
    en: enHelp
}

module.exports.initiate = () => {
    i18next
        .init({
            resources: {
                vi: {
                    translation: viTranslation
                },
                en: {
                    translation: enTranslation
                }
            },
            interpolation: {
                escapeValue: false
            }
        });
}