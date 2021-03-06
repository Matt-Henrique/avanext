const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const config = require('./config');
const cors = require('cors');

const app = express();
const router = express.Router();

// Connecta ao banco
mongoose.connect(config.connectionString);

// Carrega os Models
const User = require('./models/user');
const Transaction = require('./models/transaction');

// Carrega as Rotas
const indexRoute = require('./routes/index-route');
const userRoute = require('./routes/user-route');
const transactionRoute = require('./routes/transaction-route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Habilita o CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.options('*', cors());

app.use('/', indexRoute);
app.use('/users', userRoute);
app.use('/transactions', transactionRoute);

module.exports = app;