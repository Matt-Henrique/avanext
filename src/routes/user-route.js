const express = require('express');
const router = express.Router();
const controller = require('../controllers/user-controller');
const authService = require('../services/auth-service');

router.get('/', authService.authorize, controller.get);
router.get('/:accountNumber', authService.authorize, controller.getByAccountNumber);
router.get('/:id', authService.authorize, controller.getById);
router.post('/authenticate', controller.authenticate);
router.post('/', controller.post);

module.exports = router;