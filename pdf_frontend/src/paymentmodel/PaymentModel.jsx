import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { XCircle, ShieldCheck } from "lucide-react";
import api from "../Api";
import { useNavigate } from "react-router-dom";

const PaymentModal = ({ guide, onClose }) => {
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      console.log("🔹 Starting payment for:", guide.title);

      const guideId = guide._id || guide.id;

      // 1️⃣ Create Razorpay order in backend
      const { data } = await api.post(`/payment/create-order/${guideId}`);
      console.log("✅ Order created from backend:", data);

      if (!data?.success) {
        alert("Failed to create order. Please try again.");
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Skiez Tech",
        description: `Purchase of ${guide.title}`,
        order_id: data.orderId,

        handler: async function (response) {
          try {
            console.log("✅ Razorpay success:", response);

            // 2️⃣ Verify payment on backend
            const verifyRes = await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              guideId,
            });

            if (!verifyRes.data.success) {
              alert("Payment verification failed on server.");
              return;
            }

            // 3️⃣ Save purchase record
            try {
              await api.post("/purchase/buy", {
                guideId,
                paymentId: response.razorpay_payment_id,
              });
            } catch (err) {
              const status = err.response?.status;
              const msg =
                err.response?.data?.error || err.response?.data?.message;

              // If backend says "Already purchased", we treat it as success
              if (status === 400 && msg === "Already purchased") {
                console.log("ℹ️ User already purchased this guide, continuing.");
              } else {
                console.error("❌ Purchase save error:", err);
                alert("Payment verified but could not save purchase. Contact support.");
                return;
              }
            }

            // 4️⃣ Mark as paid in localStorage for THIS user + THIS guide
            try {
              const rawUser = localStorage.getItem("user");
              const user = rawUser ? JSON.parse(rawUser) : null;
              const userId = user?._id || user?.id;

              if (userId) {
                localStorage.setItem(`paid_${userId}_${guideId}`, "true");
              }
            } catch (e) {
              console.warn("Could not save paid flag:", e);
            }

            alert("🎉 Payment Successful! Guide unlocked.");
            onClose();
            // 5️⃣ Go to viewer for this specific guide
            navigate(`/viewer/${guideId}`);
          } catch (err) {
            console.error("❌ Error after payment:", err);
            alert("Something went wrong after payment. Please contact support.");
          }
        },

        prefill: {
          name: "Suhas",
          email: "suhas@example.com",
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const razor = new window.Razorpay(options);

      razor.on("payment.failed", function (response) {
        console.error("❌ Payment failed:", response.error);
        alert("Payment Failed: " + response.error.description);
      });

      razor.open();
    } catch (error) {
      console.error("🔥 Razorpay Error:", error);
      alert("Payment Failed. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 40 }}
        transition={{ duration: 0.4 }}
        className="
          relative bg-white/90 backdrop-blur-xl 
          rounded-2xl shadow-xl border border-blue-100 
          w-[90%] sm:w-[400px] p-8 text-center
        "
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <XCircle className="h-5 w-5" />
        </button>

        {/* Guide Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {guide.title}
        </h2>
        <p className="text-gray-500 mb-6">
          {guide.subject} • Lifetime Access
        </p>

        {/* Price Section */}
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 rounded-xl py-5 mb-6">
          <h3 className="text-4xl font-bold text-blue-600">
            {guide.price}
          </h3>
          <p className="text-gray-500 text-sm">One-time payment</p>
        </div>

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          className="
            w-full py-3 rounded-xl text-lg font-semibold 
            bg-gradient-to-r from-blue-500 to-indigo-600 
            hover:brightness-110 text-white transition-all
          "
        >
          Pay Now
        </Button>

        {/* Secure Payment */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          <span>100% Secure Payment with Razorpay</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;
