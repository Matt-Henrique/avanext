const validationContract = require('../validators/fluent-validator');
const repository = require('../repositories/transaction-repository');
const transaction = require('../models/transaction');
const userRepository = require('../repositories/user-repository');

exports.postExit = async (body) => {

    try {
        //Verificar se id passado é o mesmo do usuário logado
        // verificar se transfervalue e positivo
        let userExit = await userRepository.getById(body.userId);
        console.log(userExit.agency);
        // verificar se agencia
        let userInput = await userRepository.getByAccountNumber(body.accountNumber);
        // console.log(userInput);

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
        //atulaizar saldo
        await repository.create(transactionExit);
        console.log(transactionExit);
        console.log(body.bankCode);

        if (body.bankCode == 100) {

            const transactionInput = {
                transactionDate: new Date().toLocaleString(),
                transferValue: body.transferValue,
                bankCode: 100,
                agency: userExit.agency,
                accountNumber: userExit.accountNumber,
                userName: userExit.name,
                cpf: userExit.cpf,
                userId: userInput._id.toString()
            };
            //atulaizar saldo
            await repository.create(transactionInput);
            console.log(transactionInput);
        } else {
            //TODO: Chamar API Banco Central
        }

        return {
            success: true,
            message: "Transferência realizada!"
        };


    } catch (e) {
        return {
            success: false,
            message: "ERROR: " + e.message
        };
    }
}