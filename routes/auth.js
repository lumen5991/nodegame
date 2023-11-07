const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Route de vérification du code
router.post('/verifyCode', authController.verifyCode);

// Route de login (email et mot de passe)
router.post('/login', authController.login);

// Route de renouvellement du token (utilisez le middleware ici)
router.post('/refreshToken', authenticateToken, authController.refreshToken);

module.exports = router;
