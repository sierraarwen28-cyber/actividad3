const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado' });
  }

  jwt.verify(token, 'clave_secreta', (err, user) => {
    if (err) {
      return res.status(403).json({ mensaje: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}

module.exports = autenticarToken;
