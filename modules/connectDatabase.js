const mongo = require('mongoose');
require('dotenv').config({ path: 'secret.env' });

module.exports = async () => {
    try {
        mongo.set("strictQuery", false);
        mongo.connect(process.env.DBURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }, () => {
            console.log('DB Connected Successfully!');
        });
    } catch (err) {
        if (err) {
            console.log(err.message);
            process.exit(1);
        }
    }
}