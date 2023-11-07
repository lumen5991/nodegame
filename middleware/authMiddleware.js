const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const accessToken = req.header('Authorization');
  const refreshToken = req.header('Refresh-Token'); // Ajoutez une vérification pour le token de rafraîchissement

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ error: 'Accès non autorisé' });
  }

  const verifyToken = (token, secret, callback) => {
    jwt.verify(token, secret, callback);
  };

  if (accessToken) {
    verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        // Le token d'accès est invalide, vérifiez le token de rafraîchissement
        if (refreshToken) {
          verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET, (refreshErr, refreshUser) => {
            if (refreshErr) {
              return res.status(403).json({ error: 'Token de rafraîchissement non valide' });
            }

            // Vérifiez si le token de rafraîchissement a expiré
            const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes
            if (refreshUser.exp <= currentTime) {
              return res.status(403).json({ error: 'Token de rafraîchissement expiré' });
            }

            // Stockez l'utilisateur dans req.user
            req.user = refreshUser;
            next();
          });
        } else {
          return res.status(403).json({ error: 'Token non valide' });
        }
      } else {
        // Le token d'accès est valide, stockez l'utilisateur dans req.user
        req.user = user;
        next();
      }
    });
  } else if (refreshToken) {
    // Si seul le token de rafraîchissement est fourni, vérifiez-le
    verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET, (refreshErr, refreshUser) => {
      if (refreshErr) {
        return res.status(403).json({ error: 'Token de rafraîchissement non valide' });
      }

      // Vérifiez si le token de rafraîchissement a expiré
      const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes
      if (refreshUser.exp <= currentTime) {
        return res.status(403).json({ error: 'Token de rafraîchissement expiré' });
      }

      // Stockez l'utilisateur dans req.user
      req.user = refreshUser;
      next();
    });
  }
}

module.exports = { authenticateToken };
