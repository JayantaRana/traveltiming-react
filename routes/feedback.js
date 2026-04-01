const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// POST feedback
router.post("/", async (req, res) => {
  try {

    const feedback = new Feedback({
      ...req.body,
      busId: req.body.busId // ensure it's passed
    });

    await feedback.save();

    res.status(201).json({ message: "Feedback saved" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
