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
    // 0 = TED
    // 1 = DOC
    transferType: {
        type: Number,
        default: 0,
        enum: [0, 1]
    },
    description: {
        type: String
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