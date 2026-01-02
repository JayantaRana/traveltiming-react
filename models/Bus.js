const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  busname: { type: String, required: true },
  stops: [
    {
      name: { type: String, required: true }, // Stop name
      dt: { type: String, required: false }, // Optional departure time
    },
  ],
  cN: { type: String, required: false }, // Optional phone number
  nT:{type:String, required: false},
  pT:{type:String, required: false},
});



module.exports = mongoose.model('Bus', BusSchema);

// module.exports = busDB.model("Bus", BusSchema);//new add for popup

