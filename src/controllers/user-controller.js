const validationContract = require('../validators/fluent-validator');
const repository = require('../repositories/user-repository');
const authService = require('../services/auth-service');
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

exports.post = async(req, res, next) => {

    let contract = new validationContract();

    contract.hasMinLen(req.body.name, 5, 'O nome deve conter pelo menos 5 caracteres');
    contract.isFixedLen(req.body.cpf, 11, 'O CPF deve conter 11 caracteres');
    contract.isEmail(req.body.email, 'O e-mail está inválido');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    const user = await repository.getByCPF(req.body.cpf);

    if (user) {
        res.status(400).send({
            message: 'CPF já cadastrado'
        });
        return;
    }

    let accountNumber = await repository.getLastAccountNumber();
    accountNumber = (Number(accountNumber) + 1).toString().padStart(8, "0");

    try {
        await repository.create({
            name: req.body.name,
            cpf: req.body.cpf,
            agency: 0001,
            accountNumber: accountNumber,
            bankBalance: 0,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            active: true
        });
        res.status(201).send({
            message: 'Usuário cadastrado com sucesso'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'Erro ao cadastrar usuário'
        });
    }
};

exports.updateBankBalance = async(req, res, next) => {
    try {
        await repository.updateBankBalance(req.params.id, req.body);
        res.status(200).send({
            message: 'Saldo atualizado com sucesso'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Erro ao atualizar saldo'
        });
    }
};

exports.authenticate = async(req, res, next) => {
    try {
        const user = await repository.getByCPF(req.body.cpf);

        if (!user) {
            res.status(404).send({
                message: 'CPF não cadastrado'
            });
            return;
        }

        const userAuthenticated = await repository.authenticate({
            cpf: req.body.cpf,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if (!userAuthenticated) {
            res.status(400).send({
                message: 'Usuário ou senha inválidos'
            });
            return;
        }

        const token = authService.generateToken({
            id: userAuthenticated._id,
            cpf: userAuthenticated.cpf,
            name: userAuthenticated.name
        });

        res.status(201).send({
            token: token,
            data: {
                cpf: userAuthenticated.cpf,
                name: userAuthenticated.name
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Erro ao autenticar o usuário'
        });
    }
};
