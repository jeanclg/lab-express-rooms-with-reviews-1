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
    const { password } = req.body;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
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
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "This email is not yet registered in our website;" });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      const token = generateToken(user);

      return res.status(200).json({
        user: { name: user.name, email: user.email, _id: user._id },
        token,
      });
    }
  } catch (err) {
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// Buscar dados do usuario
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
