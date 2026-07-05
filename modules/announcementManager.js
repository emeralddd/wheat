const fs = require('fs/promises');
const path = require('path');

let announcementData = require('../announcement.json');

const reloadAnnouncementData = () => {
    delete require.cache[require.resolve('../announcement.json')];
    announcementData = require('../announcement.json');
}

const updateAnnouncementData = async (newData) => {
    const newAnnouncementData = { ...announcementData, ...newData };
    await fs.writeFile(path.join(__dirname, '../announcement.json'), JSON.stringify(newAnnouncementData));
}

const checkIgnoreCommand = (command) => {
    return announcementData.ignoredcommand.includes(command);
}

const checkIgnoreParent = (group) => {
    return announcementData.ignoredparents.includes(group);
}

module.exports = {
    get isActive() {
        return announcementData.status === "active";
    },
    get announcementData() {
        return { ...announcementData };
    },
    checkIgnoreCommand,
    checkIgnoreParent,
    reloadAnnouncementData,
    updateAnnouncementData
}