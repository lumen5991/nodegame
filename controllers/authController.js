const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');


async function verifyCode(req, res) {
    const { verificationCode } = req.body;
  
    try {
      const user = await User.findOne({ verificationCode });
  
      if (!user) {
        return res.status(401).json({ error: 'Code de vérification incorrect' });
      }
  
      res.json({ message: 'Code de vérification correct' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la vérification du code' });
    }
  }


// Gère la connexion de l'utilisateur
async function login(req, res) {
  const { email, password} = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Adresse e-mail ou mot de passe incorrect' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    const accessToken = jwt.sign({ userId: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ userId: user._id, email: user.email }, process.env.REFRESH_TOKEN_SECRET);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
}

// Gère le renouvellement du token
function refreshToken(req, res) {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign({ userId: user.userId, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });

    res.json({ accessToken });
  });
}





module.exports = { verifyCode, login, refreshToken };
