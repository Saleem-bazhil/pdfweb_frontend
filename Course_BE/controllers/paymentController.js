import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // amount in paise
      currency: "INR",
      receipt: "receipt#1",
    };

    const order = await razorpay.orders.create(options);
    console.log("🟢 Order created successfully:", order);
    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Order creation failed:", error);
    res.status(500).json({
      message: "Order creation failed",
      error: error.error ? error.error.description : error.message,
    });
  }
};
