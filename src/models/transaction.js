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
    agency: {
        type: String,
        required: false
    },
    accountNumber: {
        type: String,
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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Transaction', schema);