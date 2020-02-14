const md5 = require('md5');
const mongoose = require('mongoose');
const config = require('../src/config');

mongoose.connect(config.connectionString);

const User = require('../src/models/user');
const Transaction = require('../src/models/transaction');

const userRepository = require('../src/repositories/user-repository');
const transactionService = require('../src/services/transaction-service');

const users = require('../database/users');
const transactions = require('../database/transactions');

// User.collection.drop();
// Transaction.collection.drop();

let accountNumber;
async function getLastAccountNumber() {
    accountNumber = await userRepository.getLastAccountNumber();
}

let firstUser;
async function getUserByAccountNumber() {
    firstUser = await userRepository.getByAccountNumber('00000001');
}
  
getLastAccountNumber().then(async function () {

    console.log("Seeds de usuários...")

    for (let index = 0; index < users.length; index++) {

        const user = users[index];

        accountNumber = (Number(accountNumber) + 1).toString().padStart(8, "0");

        user.password = md5(user.password + global.SALT_KEY);
        user.accountNumber = accountNumber;
        user.agency = '0001';

        try {
            await userRepository.create(user);
        } catch (e) {
            console.log(e);
        }
    }

    getUserByAccountNumber().then(async function () {
    
        console.log("Seeds de transações...")
    
        for (let index = 0; index < transactions.length; index++) {
    
            const transaction = transactions[index];
    
            transaction.userId = firstUser._id.toString();

            try {
                const result = await transactionService.transfer(transaction);
                console.log(result.message);
            } catch (e) {
                console.log(e);
            }
        }

        console.log("Seeds finalizados.");
    
        mongoose.connection.close();
    });
});
