const repository = require('../repositories/transaction-repository');
const userRepository = require('../repositories/user-repository');

exports.transfer = async (body) => {
    try {
        let userExit = await userRepository.getById(body.userId);
        
        if (userExit === undefined || userExit === "" || userExit === null) {
            return {
                success: false,
                message: 'Usuário não encontrato!'
            };
        } else if (userExit.accountNumber === body.accountNumber) {
            return {
                success: false,
                message: 'Conta inválida!'
            };
        }
        
        let userInput = await userRepository.getByAccountNumber(body.accountNumber);

        if (userExit.bankBalance == null || userExit.bankBalance < body.transferValue) {
            return {
                success: false,
                message: 'Saldo insuficiente!'
            };
        }

        const transactionExit = {
            transactionDate: new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
            transferValue: body.transferValue * -1,
            bankCode: body.bankCode,
            agency: body.agency,
            accountNumber: body.accountNumber,
            transferType: body.transferType,
            description: body.description,
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
                transactionDate: new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
                transferValue: Number(body.transferValue),
                bankCode: 100,
                agency: userExit.agency, // Verificar erro
                accountNumber: userExit.accountNumber,
                transferType: body.transferType,
                description: body.description,
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

exports.getBankStatement = async (userId, initialDate, finalDate) => {
    try {
        let bankStatement = await repository.getBankStatementByUserId(userId, initialDate, finalDate);

        return {
            success: true,
            message: bankStatement
        };
    } catch (e) {
        return {
            success: false,
            message: "ERROR: " + e.message
        };
    }
}
