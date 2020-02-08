const mongoose = require('mongoose');
const transaction = mongoose.model('Transaction');

exports.get = async() => {
    const res = await transaction.find({
        active: true
    }, 'transactionDate transferValue bankName agency accountNumber accountType userName cpf_cnpj user');
    return res;
}

exports.getById = async(id) => {
    const res = await transaction
        .findById(id, 'transactionDate transferValue bankName agency accountNumber accountType userName cpf_cnpj user');
    return res;
}

exports.create = async(data) => {
    var transaction = new Transaction(data);
    await transaction.save();
}
