const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.get = async() => {
    const res = await User.find({
        active: true
    }, 'name cpf_cnpj accountNumber email');
    return res;
}

exports.getByAccountNumber = async(accountNumber) => {
    const res = await User
        .findOne({
            accountNumber: accountNumber,
            active: true
        }, 'name cpf_cnpj accountNumber bankBalance email');
    return res;
}

exports.getById = async(id) => {
    const res = await User
        .findById(id, 'name cpf_cnpj accountNumber bankBalance email active');
    return res;
}

exports.create = async(data) => {
    var user = new User(data);
    await user.save();
}

exports.updateBankBalance = async(id, data) => {
    await User.findByIdAndUpdate(id, {
        $set: {
            bankBalance: data.bankBalance
        }
    });
}

exports.updateActive = async(id, data) => {
    await User.findByIdAndUpdate(id, {
        $set: {
            active: data.active
        }
    });
}
