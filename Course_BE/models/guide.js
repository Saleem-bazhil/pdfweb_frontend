// models/Guide.js
const mongoose = require("mongoose");

const GuideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },

    image: { type: String, required: true },

    // Cloudinary PDF URL (secure_url)
    pdfUrl: { type: String },

    // Cloudinary public_id (IMPORTANT)
    pdfPublicId: { type: String },

    // If you use MongoDB GridFS or own storage (optional)
    pdfFile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PdfFile",
    },

    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    chapters: { type: Number, default: 0 },
    overview: { type: String },
    category: { type: String },
    tags: [String],

    purchasedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Guide || mongoose.model("Guide", GuideSchema);
