// Course_BE/routes/purchase.js
const express = require("express");
const router = express.Router();
const Purchase = require("../models/purchase");
const Guide = require("../models/Guide");    // use same casing as file
const auth = require("../middleware/auth");

router.post("/buy", auth, async (req, res) => {
  try {
    const { guideId, paymentId } = req.body;

    if (!guideId) {
      return res.status(400).json({ error: "guideId required" });
    }

    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }

    const userId = req.user.id || req.user._id.toString();

    // 🔎 Check if already purchased
    const exists = await Purchase.findOne({
      user: userId,
      guide: guideId,
      status: "completed",
    });

    if (exists) {
      // ✅ Don’t treat this as an error – just tell frontend it's already ok
      return res.json({
        message: "Already purchased",
        purchase: exists,
      });
    }

    const purchase = await Purchase.create({
      user: userId,
      guide: guideId,
      amount: guide.price,
      paymentId: paymentId || null,
      status: "completed",
    });

    return res.json({ message: "Purchase successful", purchase });
  } catch (err) {
    console.error("Purchase error:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
