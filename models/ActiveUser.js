const mongoose = require("mongoose");
const { busDB } = require("../config/db");

const activeUserSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    unique: true,
    required: true
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-remove inactive users after 30 minutes
activeUserSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 1800 }
);

module.exports = busDB.model("ActiveUser", activeUserSchema);
