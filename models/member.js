const mongo = require('mongoose');
const Schema = mongo.Schema;

const Member = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    verify: {
        type: Boolean,
    },
    premium: {
        type: Boolean,
    },
    language: {
        type: String
    },
    tarotReverseDefault: {
        type: Boolean
    }
});

module.exports = mongo.model('members', Member);