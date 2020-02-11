const validationContract = require('../validators/fluent-validator');
const repository = require('../repositories/transaction-repository');
const transactionService = require('../services/transaction-service');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Erro ao buscar transações!'
        });
    }
}

exports.getById = async (req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Erro ao buscar transação!'
        });
    }
}

exports.postTransaction = async (req, res, next) => {

    let contract = new validationContract();

    contract.hasMinLen(req.body.accountNumber, 8, 'A conta deve conter pelo menos 8 números.');
    contract.positiveValue(req.body.transferValue, 'O valor da transferência deve ser maior que zero.')
    // contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    let tes = await transactionService.postExit(req.body);

    if (tes.success) {
        return res.status(200).send(tes.message).end();


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
    }
    else {
        return res.status(400).send(tes.message).end();
    }
}
