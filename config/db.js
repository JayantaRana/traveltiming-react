const mongoose = require("mongoose");

// BUS DATABASE
const busDB = mongoose.createConnection(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 80000, }
);

// POPUP DATABASE
const popupDB = mongoose.createConnection(
  process.env.MONGO_POPUP_URI,
  { useNewUrlParser: true, useUnifiedTopology: true , serverSelectionTimeoutMS: 80000,}
);

busDB.on("connected", () => console.log("✅ Bus DB connected"));
popupDB.on("connected", () => console.log("✅ Popup DB connected"));

busDB.on("error", err => console.error("Bus DB error:", err));
popupDB.on("error", err => console.error("Popup DB error:", err));

module.exports = { busDB, popupDB };






