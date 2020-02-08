const transaction = require('../models/transaction');
const controller = require('../controllers/user-controller');

exports.checkBank = async(bankcode) => {
    if(bankcode == 100) {
        var accountDestiny  = await controller.getByAccountNumber();
        //chamar post para registro credito no saldo.
    } 
    else 
    {
        apibankcenter.send();
        //chamar post para registro de debitar no salto.
    }
}