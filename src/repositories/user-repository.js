const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.get = async() => {
    const res = await User.find({
        active: true
    }, 'name cpf accountNumber email');
    return res;
}

exports.getById = async(id) => {
    try {
        if (id.length !== 24) {
            return null;
        }
        const res = await User
            .findById(id, 'name cpf agency accountNumber bankBalance email active');
        return res;
    } catch (e) {
        return null;
    }
}

exports.getByCPF = async(cpf) => {
    const res = await User
        .findOne({
            cpf: cpf
        }, '_id name cpf agency accountNumber bankBalance email active');
    return res;
}

exports.getByAccountNumber = async(accountNumber) => {
    const res = await User
        .findOne({
            accountNumber: accountNumber,
            active: true
        }, '_id name cpf agency accountNumber bankBalance email');
    return res;
}

exports.getLastAccountNumber = async() => {
    const res = await User
        .findOne({}, {}, { sort: { 'accountNumber' : -1 } });
    if (res === null)
        return 0;
    return res.accountNumber;
}

exports.create = async(data) => {
    var user = new User(data);
    await user.save();
}

exports.updateBankBalance = async(id, bankBalance) => {
    await User.findByIdAndUpdate(id, {
        $set: {
            bankBalance: bankBalance
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

exports.authenticate = async(data) => {
    const res = await User.findOne({
        cpf: data.cpf,
        password: data.password
    });
    return res;
}
