const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Mail = require("../facades/mail");
const bcrypt = require('bcrypt'); 

function generateVerificationCode() {
  // Générez un code de vérification, par exemple, un code aléatoire à 6 chiffres
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createUser(req, res) {
  try {
    const { username,email,password } = req.body;

    // Générez un code de vérification unique
    const verificationCode = generateVerificationCode();

    // Hachez le mot de passe avant de le stocker
    const hashedPassword = await bcrypt.hash(password, 10); // Le deuxième argument est le coût du hachage

    const newUser = new User({ username, email, password: hashedPassword, verificationCode });
    await newUser.save();

    // Envoyez le code de vérification par e-mail
    Mail.to(email).send(`Hello  ${req.body.username}, voici  code de vérification : ${verificationCode}`, 'Verification de votre identité!');

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
}

async function getUser(req, res) {
  try {
    // Récupérez l'utilisateur à partir du middleware authenticateToken
    const user = req.user;

    // Renvoyez l'utilisateur connecté
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
  }
}

module.exports = { router, getUser, createUser };
