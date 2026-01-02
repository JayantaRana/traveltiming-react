const express = require("express");
const router = express.Router();
const Popup = require("../models/Popup");

/**
 * GET unseen popups
 * /api/popups?seen=1,2
 */
router.get("/", async (req, res) => {
  try {
    const seen = req.query.seen
      ? req.query.seen.split(",").map(Number)
      : [];

    const popups = await Popup.find({
      active: true,
      version: { $nin: seen }
    }).sort({ version: 1 });

    res.json(popups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/thankyou', async (req, res) => {
  try {
    const popup = await Popup.findByIdAndUpdate(
      req.params.id,
      { $inc: { thankYouCount: 1 } },
      { new: true }
    );

    res.json(popup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;



