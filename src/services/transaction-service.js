const validationContract = require('../validators/fluent-validator');
const repository = require('../repositories/transaction-repository');
const userRepository = require('../repositories/user-repository');

exports.postExit = async (body) => {

    try {
        //Verificar se id passado é o mesmo do usuário logado
        let userExit = await userRepository.getById(body.userId);
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

        // Salva no banco
        await repository.create(transactionExit);

        // Atualizar saldo
        const uptadeValueExit = transactionExit.transferValue + userExit.bankBalance;
        userRepository.updateBankBalance(transactionExit.userId, uptadeValueExit);

        if (body.bankCode == 100) {

            const transactionInput = {
                transactionDate: new Date().toLocaleString(),
                transferValue: Number(body.transferValue),
                bankCode: 100,
                agency: userExit.agency, // Verificar erro
                accountNumber: userExit.accountNumber,
                userName: userExit.name,
                cpf: userExit.cpf,
                userId: userInput._id.toString()
            };

            // Salva no banco
            await repository.create(transactionInput);
            
            // Atualizar saldo
            const uptadeValueInput = transactionInput.transferValue + userInput.bankBalance;
            userRepository.updateBankBalance(transactionInput.userId, uptadeValueInput);

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