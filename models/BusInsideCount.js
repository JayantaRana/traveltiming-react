const mongoose = require("mongoose");
const { busDB } = require("../config/db");

const busInsideCountSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    unique: true,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
});

module.exports = busDB.model("BusInsideCount", busInsideCountSchema);
