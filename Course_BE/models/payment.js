// models/Payment.js
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    paymentId: { type: String },
    signature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, default: "created" }, // created | paid | failed | refunded
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);