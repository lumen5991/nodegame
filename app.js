const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/image/uploads', express.static(path.join(__dirname, 'uploads'))); // lien qui va vers le dossier uploads
// Middleware pour gérer les CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://vercel.com/lumens-projects/vuegame-g9ik.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Importez vos fichiers de routage
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const imageRouter =  require('./routes/picture'); // route de l'image
const mailRouter = require('./routes/mail')

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/image', imageRouter);
app.use('/api/mail', mailRouter)

module.exports = app;
