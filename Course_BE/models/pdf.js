// models/PdfFile.js
const mongoose = require("mongoose");

const PdfFileSchema = new mongoose.Schema({
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guide",
    required: true,
  },

  filename: { type: String, required: true },
  originalName: { type: String, required: true },

  mimeType: { type: String, required: true },
  size: { type: Number, required: true },

  // NOT public downloadable link (stored on server)
  filePath: { type: String, required: true },

  uploadedAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.PdfFile || mongoose.model("PdfFile", PdfFileSchema);
