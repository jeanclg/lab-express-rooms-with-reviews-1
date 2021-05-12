const router = require("express").Router();
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const UserModel = require("../models/User.model");
const generateToken = require("../config/jwt.config");
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

// Cria o Usuario
router.post("/signup/user", async (req, res) => {
  try {
    // Pega a senha inputada pelo cadastro do cliente
    const { password } = req.body;
    // Gera um código de forma aleatória
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    // Criptografa a senha cadastrada somada a variavel 'salt'
    const hashedPassword = await bcrypt.hash(password, salt);
    // Retorna o usuario criado com a senha cadastrada sendo criptografada
    const result = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Pega os dados de email e senha inputadas pelo cliente
    const { email, password } = req.body;
    // Acha o usuario cadastrado no banco com o mesmo email inputado pelo cliente
    const user = await UserModel.findOne({ email });
    // Retorna um erro caso o email ainda não seja cadastrado
    if (!user) {
      return res
        .status(400)
        .json({ msg: "This email is not yet registered in our website;" });
    }
    // Faz a descriptografia da senha para verificar se o cliente colocou corretamente
    if (await bcrypt.compare(password, user.passwordHash)) {
      // Gera um token para o usuario que o cliente conseguiu acessar
      const token = generateToken(user);
      // Retorna o usuario com o token para o cliente
      return res.status(200).json({
        user: { name: user.name, email: user.email, _id: user._id },
        token,
      });
    }
  } catch (err) {
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// Buscar dados do usuario [cRud]
// A primeira middleware verifica se o token fornecido pelo cliente bate com o usuario, caso esteja passa para a proxima middleware
// O segundo middleware pega o usuario passado pela middleware anterior e retorna para a rota atual
router.get("/profile", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    if (loggedInUser) {
      return res.status(200).json(loggedInUser);
    } else {
      return res.status(404).json({ msg: "User not found." });
    }
  } catch (err) {
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

module.exports = router;
