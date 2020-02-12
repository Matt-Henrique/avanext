const express = require('express');
const router = express.Router();
const controller = require('../controllers/user-controller');
const authService = require('../services/auth-service');

router.get('/', authService.authorize, controller.get);
router.get('/:id', authService.authorize, controller.getById);
router.get('/accountNumber/:accountNumber', authService.authorize, controller.getByAccountNumber);
router.get('/cpf/:cpf', controller.hasCPF);
router.post('/authenticate', controller.authenticate);
router.post('/', controller.post);
router.patch('/bankBalance/:id', authService.authorize, controller.updateBankBalance);

module.exports = router;