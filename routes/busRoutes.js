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
const auth = require("../middleware/auth");



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


// 🔎 Search buses by bus name (for Search Screen)
router.get('/search-by-name', async (req, res) => {
  const { name } = req.query;

  try {
    if (!name) return res.json([]);

    const buses = await Bus.find({
      busname: { $regex: name, $options: 'i' }  // ✅ FIXED
    });

    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/search-by-stop', async (req, res) => {
  const { stop } = req.query;

  try {
    if (!stop) return res.json([]);

    const buses = await Bus.find({
      "stops.name": { $regex: stop, $options: "i" }
    });

    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




//add for bus count admin
// router.get("/my-bus-count",auth, async (req,res)=>{

//   try{

//     const admin = req.user.username;

//     const count = await AdminLog.countDocuments({
//       admin:admin,
//       action:"add_bus"
//     });

//     res.json({count});

//   }catch(err){

//     res.status(500).json({message:"error"});

//   }

// });

router.get("/admin-bus-count", auth, async (req,res)=>{

  try{

    const count = await AdminLog.countDocuments({
      admin:req.user.username,
      action:"ADD_BUS"
    });

    res.json({count});

  }catch(err){

    res.status(500).json({error:err.message});

  }

});


//add for dashboard
router.get("/:id",  async (req, res) => {
  try {

    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json(bus);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id",auth, async (req, res) => {
  try {

    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedBus);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new bus
// router.post("/",auth,  async (req, res) => {
//   try {

//     const { busname, cN, pT, nT, stops } = req.body;

//     const newBus = new Bus({
//       busname,
//       cN,
//       pT,
//       nT,
//       stops
//     });

//     await newBus.save();
      


   


//     res.status(201).json(newBus);

//   } catch (err) {
//       console.log("ADD BUS ERROR:", err);

//     res.status(500).json({ error: err.message });

//   }
// });

router.post("/", auth, async (req, res) => {
  try {

    let { busname, cN, pT, nT, stops } = req.body;

    // clean stops
    stops = stops.map(stop => ({
      name: stop.name,
      ...(stop.dt && { dt: stop.dt })
    }));

    const busData = {
      busname,
      stops
    };

    if (cN) busData.cN = cN;
    if (pT) busData.pT = pT;
    if (nT) busData.nT = nT;

    const newBus = new Bus(busData);

    await newBus.save();





    res.status(201).json(newBus);

  } catch (err) {

    console.log(err);
    res.status(500).json({ error: err.message });

  }
});

module.exports = router;







