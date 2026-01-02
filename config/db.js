const mongoose = require("mongoose");

let busDB;
let popupDB;

if (!global._mongoConnections) {
  global._mongoConnections = {};
}

if (!global._mongoConnections.busDB) {
  global._mongoConnections.busDB = mongoose.createConnection(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 80000,
    }
  );
}

if (!global._mongoConnections.popupDB) {
  global._mongoConnections.popupDB = mongoose.createConnection(
    process.env.MONGO_POPUP_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 80000,
    }
  );
}

busDB = global._mongoConnections.busDB;
popupDB = global._mongoConnections.popupDB;

busDB.once("connected", () =>
  console.log("✅ Bus DB connected")
);

popupDB.once("connected", () =>
  console.log("✅ Popup DB connected")
);

module.exports = { busDB, popupDB };
