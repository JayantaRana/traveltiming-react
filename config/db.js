const mongoose = require("mongoose");

const busDB = mongoose.createConnection(
  process.env.MONGO_BUS_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const popupDB = mongoose.createConnection(
  process.env.MONGO_POPUP_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

busDB.on("connected", () =>
  console.log("✅ Bus DB connected")
);

popupDB.on("connected", () =>
  console.log("✅ Popup DB connected")
);

busDB.on("error", err =>
  console.error("❌ Bus DB error:", err)
);

popupDB.on("error", err =>
  console.error("❌ Popup DB error:", err)
);

module.exports = { busDB, popupDB };
