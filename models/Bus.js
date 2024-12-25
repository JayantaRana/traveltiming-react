const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  bus_name: { type: String, required: true },
  stops: [
    {
      name: { type: String, required: true }, // Stop name
      departure_time: { type: String, required: false }, // Optional departure time
    },
  ],
  phone: { type: String, required: false }, // Optional phone number
});

// Add an index to the 'stops.name' field
BusSchema.index({ 'stops.name': 1 });

module.exports = mongoose.model('Bus', BusSchema);

