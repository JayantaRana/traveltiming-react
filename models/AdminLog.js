const mongoose = require("mongoose");

const AdminLogSchema = new mongoose.Schema({

  admin:{
    type:String
  },

  action:{
    type:String
  },

  busname:{
    type:String
  },

  time:{
    type:Date,
    default:Date.now
  }

});

module.exports = mongoose.model("AdminLog", AdminLogSchema);
