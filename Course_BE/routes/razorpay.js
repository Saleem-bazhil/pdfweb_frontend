const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const razorpay = require("../utils/razorpay");
const Guide = require("../models/Guide");
const auth = require("../middleware/auth");


// =========================
// 1) CREATE RAZORPAY ORDER
// =========================
router.post("/create-order/:guideId", auth, async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.guideId);

        if (!guide) return res.status(404).json({ error: "Guide not found" });

        const options = {
            amount: guide.price * 100, // convert ₹ to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            key_id: process.env.RAZORPAY_KEY_ID,
            currency: order.currency
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =========================
// 2) VERIFY PAYMENT
// =========================
router.post("/verify", auth, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, guideId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        // Unlock Guide for User
        const guide = await Guide.findById(guideId);
        if (!guide) return res.status(404).json({ error: "Guide not found" });

        if (!guide.purchasedBy.includes(req.user.id)) {
            guide.purchasedBy.push(req.user.id);
            await guide.save();
        }

        res.json({ success: true, message: "Payment verified & guide unlocked" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
