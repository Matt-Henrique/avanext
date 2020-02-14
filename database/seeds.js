const md5 = require('md5');
const mongoose = require('mongoose');
const config = require('../src/config');

mongoose.connect(config.connectionString);

const User = require('../src/models/user');
const Transaction = require('../src/models/transaction');

const userRepository = require('../src/repositories/user-repository');
const transactionRepository = require('../src/repositories/transaction-repository');

const users = require('../database/users');
const transactions = require('../database/transactions');

// User.collection.drop();
// Transaction.collection.drop();

let accountNumber;
async function getLastAccountNumber() {
    accountNumber = await userRepository.getLastAccountNumber();
}
  
getLastAccountNumber()
  .then(async function () {

    console.log("Seeds de usuários...")

    for (let index = 0; index < users.length; index++) {

        const user = users[index];

        accountNumber = (Number(accountNumber) + 1).toString().padStart(8, "0")

        user.password = md5(user.password + global.SALT_KEY);
        user.accountNumber = accountNumber;
        user.agency = '0001';

        try {
            await userRepository.create(user);
        } catch (e) {
            console.log(e);
        }
    }

    console.log("Seeds finalizados.")

    mongoose.connection.close();
});
