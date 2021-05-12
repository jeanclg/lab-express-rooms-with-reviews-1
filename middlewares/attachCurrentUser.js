const UserModel = require("../models/User.model");

// Exporta o usuario para a proxima middleware ou rota
module.exports = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    // Filtra o usuario passado pela autenticação no banco e retorna o usuario SEM senha, NUNCA retorne esse usuario com a senha
    const user = await UserModel.findOne(
      { _id: loggedInUser._id },
      { passwordHash: 0 },
      { __v: 0 }
    );

    if (!user) {
      // 400 significa Bad Request
      return res.status(400).json({ msg: "User does not exist." });
    }

    req.currentUser = user;
    return next();
  } catch (err) {
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
};
