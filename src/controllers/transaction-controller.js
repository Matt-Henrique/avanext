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

exports.getBankStatement = async (req, res, next) => {

    let contract = new validationContract();

    const initialDate = new Date(req.params.initialDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
    const finalDate = new Date(req.params.finalDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));

    contract.isDate(initialDate, 'A data inicial está inválida.');
    contract.isDate(finalDate, 'A data final está inválida.');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    if (initialDate > finalDate) {
        return res.status(400).send('A data inicial não pode ser maior que a data final.').end();
    }

    let result = await transactionService.getBankStatement(req.params.userId, req.params.initialDate, req.params.finalDate);

    if (result.success) {
        return res.status(200).send(result.message).end();
    }
    else {
        return res.status(400).send(result.message).end();
    }
}

exports.postTransfer = async (req, res, next) => {

    let contract = new validationContract();

    contract.positiveValue(req.body.transferValue, 'O valor da transferência deve ser maior que zero.');
    contract.hasMinLen(req.body.agency, 4, 'A agência deve conter pelo menos 4 números.');
    contract.hasMinLen(req.body.accountNumber, 8, 'A conta deve conter pelo menos 8 números.');
    contract.hasMinLen(req.body.userName, 4, 'O nome deve conter pelo menos 4 caracteres.');
    contract.hasMinLen(req.body.cpf, 11, 'O nome deve conter pelo menos 11 números.');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    let result = await transactionService.transfer(req.body);

    if (result.success) {
        return res.status(200).send(result.message).end();
    }
    else {
        return res.status(400).send(result.message).end();
    }
}
