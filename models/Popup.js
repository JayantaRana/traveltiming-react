const mongoose = require("mongoose");
const { popupDB } = require("../config/db");

const popupSchema = new mongoose.Schema(
  {
    version: {
      type: Number,
      required: true,
      unique: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    imageUrl: {
      type: String,
      default: "" // 👈 OPTIONAL (bus image)
    },

    active: {
      type: Boolean,
      default: true
    },

    thankYouCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = popupDB.model("Popup", popupSchema);
