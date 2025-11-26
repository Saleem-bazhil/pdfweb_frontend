require("dotenv").config();
const Razorpay = require("razorpay");

// ✅ Create instance and export it
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpay;
