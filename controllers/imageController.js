const express = require('express');
const Image = require('../models/image');
const upload = require('../middleware/multer');

const { baseUrl } = require('../config/baseUrl'); // Assurez-vous que vous avez une configuration pour la base URL
// Middleware pour envoyer une image
const uploadImage = async (req, res) => {
  try {
    upload.single('file')(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ error: 'Erreur lors du téléchargement de l\'image' });
      }
      const { originalname, buffer, mimetype } = req.file;
      const { description } = req.body; 

      const url = `${baseUrl}/uploads/${originalname}`; 

      const newImage = new Image({
        name: originalname,
        data: buffer,
        contentType: mimetype,
        url: url, 
        description: description, 
      });

      const savedImage = await newImage.save();
      res.status(201).json({ message: 'Image téléchargée avec succès', image: savedImage });
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du téléchargement de l\'image' });
  }
};

// Middleware pour récupérer et afficher une image par ID
const getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      res.status(404).json({ error: 'Image non trouvée' });
      return;
    }
    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'image' });
  }
};

const getAllImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de toutes les images' });
  }
};
module.exports = {
  uploadImage,
  getImageById,
  getAllImages
};
