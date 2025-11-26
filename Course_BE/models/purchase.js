// models/Purchase.js
const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  guide: { type: mongoose.Schema.Types.ObjectId, ref: "Guide", required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  paymentId: { type: String },
  status: { type: String, default: "completed" }, // or 'pending'
});

module.exports =
  mongoose.models.Purchase || mongoose.model("Purchase", PurchaseSchema);
