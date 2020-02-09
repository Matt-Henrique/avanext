const validationContract = require('../validators/fluent-validator');
const repository = require('../repositories/transaction-repository');

exports.get = async(req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Erro ao buscar transações!'
        });
    }
}

exports.getById = async(req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Erro ao buscar transação!'
        });
    }
}

exports.post = async(req, res, next) => {

    let contract = new validationContract();

    contract.hasMinLen(req.body.accountNumber, 8, 'O nome deve conter pelo menos 5 caracteres');
    // contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create({
            transactionDate: req.body.transactionDate,
            transferValue: req.body.transferValue,
            bankName: req.body.bankName,
            agency: req.body.agency,
            accountNumber: req.body.accountNumber,
            userName: req.body.userName,
            cpf: req.body.cpf,
            // user: req.body.user
        });
        res.status(201).send({
            message: 'Transação realizada!'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'Erro na transação!'
        });
    }
};