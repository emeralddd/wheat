const mongo = require('mongoose');
const Schema = mongo.Schema;

const Server = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    premium: {
        type: Boolean,
    },
    prefix: {
        type: String
    },
    language: {
        type: String
    },
    disable: {
        type: Map
    }
});

module.exports = mongo.model('servers', Server);