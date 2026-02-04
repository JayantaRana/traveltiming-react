const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const ActiveUser = require("../models/ActiveUser");
const BusInsideCount = require("../models/BusInsideCount");

/**
 * TOGGLE ON
 */
router.post("/toggle-on", async (req, res) => {
  try {
    const { deviceId, busId } = req.body;
    const busObjectId = new mongoose.Types.ObjectId(busId);

    const active = await ActiveUser.findOne({ deviceId });

    // If user was already inside another bus
    if (active && active.busId.toString() !== busId) {
      await BusInsideCount.updateOne(
        { busId: active.busId },
        { $inc: { count: -1 } }
      );
    }

    // Set new active bus
    await ActiveUser.updateOne(
      { deviceId },
      { busId: busObjectId, updatedAt: new Date() },
      { upsert: true }
    );

    // Increment count
    await BusInsideCount.updateOne(
      { busId: busObjectId },
      { $inc: { count: 1 } },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * TOGGLE OFF
 */
router.post("/toggle-off", async (req, res) => {
  try {
    const { deviceId } = req.body;

    const active = await ActiveUser.findOne({ deviceId });

    if (active) {
      await BusInsideCount.updateOne(
        { busId: active.busId },
        { $inc: { count: -1 } }
      );

      await ActiveUser.deleteOne({ deviceId });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET COUNT
 */
router.get("/count/:busId", async (req, res) => {
  const data = await BusInsideCount.findOne({
    busId: req.params.busId
  });

  res.json({ count: data?.count || 0 });
});

// router.get("/status/:busId/:deviceId", async (req, res) => {
//   const { busId, deviceId } = req.params;

//   const exists = await BusToggle.findOne({ busId, deviceId });

//   res.json({ inside: !!exists });
// });


router.get("/status/:busId/:deviceId", async (req, res) => {
  try {
    const { busId, deviceId } = req.params;

    const active = await ActiveUser.findOne({ deviceId });

    const inside =
      active && active.busId.toString() === busId;

    res.json({ inside });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
