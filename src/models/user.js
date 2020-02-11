const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    agency: {
        type: Number,
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    bankBalance: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = mongoose.model('User', schema);