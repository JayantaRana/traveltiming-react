const mongoose = require("mongoose");
const { busDB } = require("../config/db");   // 👈 important

const AdminLogSchema = new mongoose.Schema({

  admin: String,

  action: String,

  busname: String,

  time:{
    type: Date,
    default: Date.now
  }

});

module.exports = busDB.model("AdminLog", AdminLogSchema);
