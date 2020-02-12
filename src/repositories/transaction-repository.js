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

exports.getBankStatementByUserId = async(userId, initialDate, finalDate) => {
    const res = await transactionDb.find(
        {
            //userId: userId,
            transactionDate: {"$gte": initialDate, "$lt": finalDate} 
        }
    );
    return res;
}

exports.create = async(data) => {
    const transaction = new transactionDb(data);
    await transaction.save();
}
