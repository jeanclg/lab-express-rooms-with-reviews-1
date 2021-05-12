const router = require("express").Router();

// Importando o modelo que vamos usar
const RoomModel = require("../models/Room.model");

// Criar novo room [Crud]
router.post("/signup", async (req, res) => {
  try {
    // Criaçao do room no banco
    const result = await RoomModel.create(req.body);
    // Retorna para o cliente o room criado
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// Listar todos os rooms disponiveis [cRud]
router.get("/rooms", async (req, res) => {
  try {
    // Lista todos os rooms cadastrados no banco
    const result = await RoomModel.find();
    // Retorna a lista para o cliente
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// Listar room especifico [cRud]
router.get("/room/:id", async (req, res) => {
  try {
    // Filtra o room especifico pelo id inputado pelo cliente na url da requisiçao
    const result = await RoomModel.findOne({ _id: req.params.id }).populate(
      "reviews"
    );
    // Retorna para o cliente o room filtrado
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// Atualizar dados de um room especifico [crUd]
router.patch("/room/:id", async (req, res) => {
  try {
    const updateResult = await RoomModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    return res.status(201).send(updateResult);
  } catch (err) {
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// Deletar um room especifico [cruD]
router.delete("/room/:id", async (req, res) => {
  try {
    const result = await RoomModel.deleteOne({ _id: req.params.id });
    return res.status(201).send({});
  } catch (err) {
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

module.exports = router;
