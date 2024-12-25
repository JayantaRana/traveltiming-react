const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');


router.get('/search', async (req, res) => {
  const { source, destination } = req.query;

  try {
    const buses = await Bus.aggregate([
      { $unwind: '$stops' },
      {
        $match: {
          'stops.name': { $in: [source, destination] },
        },
      },
      {
        $group: {
          _id: '$bus_name',
          stops: { $push: '$stops' },
          phone: { $first: '$phone' },
        },
      },
      {
        $project: {
          bus_name: '$_id',
          stops: 1,
          phone: 1,
          _id: 0,
        },
      },
    ]);

    const filteredBuses = buses.filter((bus) => {
      const stops = bus.stops.map((stop) => stop.name);
      return stops.indexOf(source) < stops.indexOf(destination);
    });

    res.json(filteredBuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;




// // Get all buses
// router.get('/', async (req, res) => {
//   try {
//     const buses = await Bus.find();
//     res.json(buses);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Search buses by source and destination
// router.get('/search', async (req, res) => {
//   const { source, destination } = req.query;

//   try {
//     const buses = await Bus.find({
//       'stops.name': { $all: [source, destination] },
//     });
    

//     // Filter to ensure source comes before destination
//     const filteredBuses = buses.filter((bus) => {
//       const stops = bus.stops.map((stop) => stop.name);
//       return stops.indexOf(source) < stops.indexOf(destination);
//     });

//     res.json(filteredBuses);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;
