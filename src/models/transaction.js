const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    transactionDate : {
        type: Date,
        required: true
    },
    transferValue: {
        type: Number,
        required: true
    },
    bankCode: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    agency: {
        type: Number,
        required: true
    },
    accountNumber: {
        type: Number,
        required: true
    },
    // 0 = Conta Corrente
    // 1 = Conta Poupança
    accountType: {
        type: Number,
        default: 0,
        enum: [0, 1]
    },
    userName: {
        type: String
    },
    cpf: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Transaction', schema);