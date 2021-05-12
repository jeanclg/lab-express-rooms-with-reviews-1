const router = require("express").Router();

const ReviewModel = require("../models/Review.model");
const UserModel = require("../models/Room.model");

// Criar um novo review [Crud]
router.post("/room/:id/review", async (req, res) => {
  try {
    // Cadastra um novo review no banco
    const result = await ReviewModel.create(req.body);
    // Atualiza o room com o review criado para o mesmo
    const updateRoom = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { reviews: result._id } },
      { new: true }
    );
    // Retorna para o cliente o room ja atualizado com o review
    return res.status(201).json(updateRoom);
  } catch (err) {
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

module.exports = router;
