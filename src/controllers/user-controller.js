const validationContract = require('../validators/fluent-validator');
const repository = require('../repositories/user-repository');
const md5 = require('md5');

exports.get = async(req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Erro ao buscar os usuários'
        });
    }
}

exports.getByAccountNumber = async(req, res, next) => {
    try {
        var data = await repository.getByAccountNumber(req.params.accountNumber);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Erro ao buscar usuário'
        });
    }
}

exports.getById = async(req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Erro ao buscar usuário'
        });
    }
}

exports.post = async(req, res, next) => {

    let contract = new validationContract();

    contract.hasMinLen(req.body.name, 5, 'O nome deve conter pelo menos 5 caracteres');
    contract.isCpfOrCnpj(req.body.cpf_cnpj, 11, 'O documento está inválido');
    contract.isEmail(req.body.email, 'O e-mail está inválido');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    const accountNumber = 0;

    try {
        await repository.create({
            name: req.body.name,
            cpf_cnpj: req.body.cpf_cnpj,
            accountNumber: accountNumber,
            bankBalance: 0,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            active: true
        });
        res.status(201).send({
            message: 'Produto cadastrado com sucesso!'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};
