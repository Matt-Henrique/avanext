require('dotenv').config();

global.SALT_KEY = process.env.SALT_KEY;

module.exports = {
    connectionString: process.env.CONNECTION_STRING
};
