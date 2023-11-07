// routes.js
const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController'); // Le contrôleur

// Route pour envoyer une image
router.post('/upload', imageController.uploadImage);

// Route pour récupérer et afficher une image par ID
router.get('/download/:id', imageController.getImageById);

// Route pour obtenir toutes les images
router.get('/all', imageController.getAllImages);


module.exports = router;
