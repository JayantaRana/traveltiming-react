const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true,
  },

  busName: {
    type: String,
    required: true,
  },

  route: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: [
      "Wrong timing",
      "Bus not running",
      "Late arrival",
      "Early arrival",
      "Driver behavior",
      "Other",
    ],
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // optional but good
  }

});

module.exports = mongoose.model("Feedback", feedbackSchema);
