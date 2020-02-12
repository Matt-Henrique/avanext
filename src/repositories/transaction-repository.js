const mongoose = require('mongoose');
const transactionDb = mongoose.model('Transaction');

exports.get = async() => {
    const res = await transactionDb.find();
    return res;
}

exports.getById = async(id) => {
    const res = await transactionDb
        .findById(id);
    return res;
}

exports.getBankStatement = async(id) => {
    // TODO: Obter extrato por datas
    return null;
}

exports.create = async(data) => {
    const transaction = new transactionDb(data);
    await transaction.save();
}
