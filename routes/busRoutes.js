// const express = require('express');
// const router = express.Router();
// const Bus = require('../models/Bus');





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


//update for shorted time 
const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');

// Convert time to 24-hour format for sorting
function convertTo24Hour(time) {
  if (!time) return null; // Handle cases where time is missing
  const [hours, minutes, period] = time.match(/(\d+):(\d+)\s?(AM|PM)/i).slice(1);
  let hours24 = parseInt(hours, 10);
  if (period.toUpperCase() === 'PM' && hours24 < 12) {
    hours24 += 12;
  }
  if (period.toUpperCase() === 'AM' && hours24 === 12) {
    hours24 = 0;
  }
  return `${hours24.toString().padStart(2, '0')}:${minutes}`;
}

// Get all buses
router.get('/', async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search buses by source and destination
router.get('/search', async (req, res) => {
  const { source, destination } = req.query;

  try {
    const buses = await Bus.find({
      'stops.name': { $all: [source, destination] },
    });

    // Filter to ensure source comes before destination
    const filteredBuses = buses.filter((bus) => {
      const stops = bus.stops.map((stop) => stop.name);
      return stops.indexOf(source) < stops.indexOf(destination);
    });

    // Sort buses by source departure time
    const sortedBuses = filteredBuses.map((bus) => {
      const sourceStop = bus.stops.find((stop) => stop.name === source);
      return {
        ...bus.toObject(),
        sourceTime: sourceStop ? convertTo24Hour(sourceStop.dt) : null,
      };
    });

    sortedBuses.sort((a, b) => {
      if (a.sourceTime === null) return 1; // Push buses with no source time to the end
      if (b.sourceTime === null) return -1;
      return a.sourceTime.localeCompare(b.sourceTime);
    });

    res.json(sortedBuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

