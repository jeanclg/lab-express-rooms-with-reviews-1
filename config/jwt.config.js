const jwt = require("jsonwebtoken");

// Exporta a função que retorna um token e atrela esse token ao usuario passado via parametro
module.exports = function generateToken(user) {
  // A senha NUNCA pode ser enviada no token.
  const { _id, name, email } = user;

  // Acessando a variável de ambiente definida no .env
  const signature = process.env.TOKEN_SIGN_SECRET;
  const expiration = "6h";

  return jwt.sign({ _id, name, email }, signature, { expiresIn: expiration });
};
