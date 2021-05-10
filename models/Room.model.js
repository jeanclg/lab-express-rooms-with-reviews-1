const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  reviews: [], // we will update this field a bit later when we create review model
});

module.exports = mongoose.model("Room", RoomSchema);
