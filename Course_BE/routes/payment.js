// routes/payment.js
const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const razorpay = require("../config/razorpay");     
const Guide = require("../models/guide");        
const Payment = require("../models/payment");      
const auth = require("../Middleware/auth");        

// ==============================
// 1️⃣ CREATE RAZORPAY ORDER
// POST /api/payment/create-order/:guideId
// ==============================
router.post("/create-order/:guideId", auth, async (req, res) => {
  try {
    const guideId = req.params.guideId;

    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res
        .status(404)
        .json({ success: false, message: "Guide not found" });
    }

    const userId = req.user.id || req.user._id.toString();

    const options = {
      amount: guide.price * 100,  // ₹ → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        guideId: guide._id.toString(),
        userId: userId,
      },
    };

    const order = await razorpay.orders.create(options);

    // 🧾 Save initial payment record (optional but helpful for logs)
    await Payment.create({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "created",
      userId: userId,
    });

    // 🔁 Match what your frontend expects (orderId, keyId, amount, currency, guideId)
    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      keyId: process.env.RAZORPAY_KEY_ID,
      currency: order.currency,
      guideId: guide._id,
    });
  } catch (err) {
    console.error("Create order error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Order creation failed" });
  }
});

// ==============================
// 2️⃣ VERIFY PAYMENT & UNLOCK GUIDE
// POST /api/payment/verify
// body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, guideId }
// ==============================
router.post("/verify", auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      guideId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay payment details",
      });
    }

    // ✅ Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    const userId = req.user.id || req.user._id.toString();

    // 💾 Update payment status
    await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id, userId: userId },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "paid",
      }
    );

    // 🔓 Unlock Guide for this user
    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res
        .status(404)
        .json({ success: false, message: "Guide not found" });
    }

    if (!Array.isArray(guide.purchasedBy)) {
      guide.purchasedBy = [];
    }

    const alreadyHas = guide.purchasedBy.some(
      (uid) => uid.toString() === userId
    );

    if (!alreadyHas) {
      guide.purchasedBy.push(userId);
      await guide.save();
    }

    return res.json({
      success: true,
      message: "Payment verified & guide unlocked",
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
});

module.exports = router;
