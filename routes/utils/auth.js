const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "boutique2019";

function createToken(data = {}) {
  return jwt.sign(data, SECRET_KEY, { expiresIn: "3days" });
}

async function validateToken(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(404).send({ message: "No se encontro la autorizacion" });
  }

  const isValid = await isValidToken(authorization);

  if (!isValid) {
    return res.status(404).send({ message: "Token invalido" });
  }

  next();
}

function isValidToken(token) {
  return new Promise(resolve => {
    jwt.verify(token, SECRET_KEY, error => {
      resolve(!error);
    });
  });
}

module.exports = {
  validateToken,
  createToken
};
