const router = require("express").Router();

const ReviewModel = require("../models/Review.model");
const UserModel = require("../models/Room.model");

// Criar um novo review [Crud]
router.post("/room/:id/review", async (req, res) => {
  try {
    const result = await ReviewModel.create(req.body);
    const updateRoom = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { reviews: result._id } },
      { new: true }
    );
    return res.status(201).json(updateRoom);
  } catch (err) {
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

module.exports = router;
