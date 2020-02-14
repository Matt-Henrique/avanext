const express = require('express');
const router = express.Router();
const controller = require('../controllers/transaction-controller');
const authService = require('../services/auth-service');

// router.get('/', authService.authorize, controller.get);
router.get('/:id', authService.authorize, controller.getById);
router.get('/bankStatement/:userId&:initialDate&:finalDate', authService.authorize, controller.getBankStatement);
router.post('/transfer/', authService.authorize, controller.postTransfer);

module.exports = router;