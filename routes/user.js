const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

const userController = require('../controllers/userController')

router.get('/getUser', authenticateToken, userController.getUser);

router.post('/add', userController.createUser);


module.exports = router;
