const validationContract = require('../validators/fluent-validator');
const repository = require('../repositories/transaction-repository');
const transaction = require('../models/transaction');
const userRepository = require('../repositories/user-repository');

//verrificar se id do token é mesmo do id da transferência
// if (req.body.bankCode == '100') {

//     try {
//         await transactionService.postExit(req.body, ret);
//         await transactionService.postInput(req.body, ret);
//         res.status(200).send({ message: 'Transferência realizada!' })
//     } catch (error) {
//         res.status(500).send({
//             message: 'Erro na Transferência!1'
//         });
//     }


// } else {

//     try {
//         //chamada fake da api
//         await transactionService.postExit(req.body);
//         res.status(200).send({ message: 'Transferência realizada!' })
//     } catch (error) {
//         res.status(500).send({
//             message: 'Erro na Transferência!2'
//         });
//     }
// }

exports.postExit = async (body) => {

    try {
        //Verificar se id passado é o mesmo do usuário logado
        // verificar se transfervalue e positivo
        let userExit = await userRepository.getById(body.userId);
        // verificar se agencia
        let userInput = await userRepository.getByAccountNumber(body.accountNumber);

        if (userExit === undefined || userExit === "" || userExit === null) {
            return {
                success: false,
                message: 'Usuário não encontrato!'
            };
        }

        if (userExit.bankBalance == null || userExit.bankBalance < body.transferValue) {
            return {
                success: false,
                message: 'Saldo insuficiente!'
            };
        }


        const transactionExit = {
            transactionDate: new Date().toLocaleString(),
            transferValue: body.transferValue * -1,
            bankCode: body.bankCode,
            agency: body.agency,
            accountNumber: body.accountNumber,
            userName: body.userName,
            cpf: body.cpf,
            userId: body.userId
        };

        const transactionInput = {
            transactionDate: new Date().toLocaleString(),
            transferValue: body.transferValue,
            bankCode: 100,
            agency: userExit.agency,
            accountNumber: userExit.accountNumber,
            name: userExit.name,
            cpf: userExit.cpf
        };

        // await repository.create(transactionExit);
        // await repository.create(transactionInput);

        return {
            success: true,
            message: transactionInput
        };


    } catch (e) {
        return {
            success: false,
            message: "ERROR: " + e.message
        };
    }
}

// exports.postInput = async (body) => {

//     try {
//         await repository.create({
//             transactionDate: body.transactionDate,
//             transferValue: body.transferValue,
//             bankCode: body.bankCode,
//             bankName: body.bankName,
//             agency: body.agency,
//             accountNumber: body.accountNumber,
//             userName: body.userName,
//             cpf_cnpj: body.cpf_cnpj,
//             // user: req.body.user
//         });
//         ret.status(201).send({
//             message: 'Transação realizada!'
//         });
//     } catch (e) {
//         ret.status(500).send({
//             message: 'Erro na transação!4'
//         });
//     }
// }