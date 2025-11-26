// Course_BE/routes/pdf.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const axios = require("axios"); // 🔥 for remote PDF URLs

const PdfFile = require("../models/pdf");       // ✅ matches models/pdf.js
const Guide = require("../models/guide");       // ✅ your Guide model
const Purchase = require("../models/purchase"); // ✅ matches models/purchase.js
const auth = require("../Middleware/auth");     // ✅ must set req.user.id or req.user._id

const router = express.Router();

// 🔹 Upload directory (NOT exposed as static)
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 🔹 Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.originalname.toLowerCase().endsWith(".pdf")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

/**
 * POST /api/pdf/upload
 * form-data:
 *  - pdf: file
 *  - guideId: guide to attach this pdf to
 */
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { guideId } = req.body;
    if (!guideId) {
      return res.status(400).json({ error: "guideId is required" });
    }

    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }

    const buffer = fs.readFileSync(req.file.path);

    let text = "";
    try {
      const data = await pdfParse(buffer);
      text = data.text;
    } catch (err) {
      console.log("pdf-parse failed:", err.message);
    }

    const fakePdfUrl = `/internal/${req.file.filename}`; // optional info

    const saved = await PdfFile.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      textExtract: text,
      pdfUrl: fakePdfUrl,
    });

    // Guide should have: pdfFile: { type: ObjectId, ref: "PdfFile" }
    guide.pdfFile = saved._id;
    await guide.save();

    res.json({
      message: "PDF uploaded & attached to guide successfully",
      file: saved,
    });
  } catch (err) {
    console.error("PDF upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/pdf/view/:guideId
 * Stream the PDF if and only if:
 *  - user is authenticated
 *  - user has a completed Purchase for this guide
 * Supports:
 *  - Local uploaded PDFs (PdfFile / uploads)
 *  - Remote pdfUrl on Guide (http/https)
 */
router.get("/view/:guideId", auth, async (req, res) => {
  try {
    const guideId = req.params.guideId;

    const guide = await Guide.findById(guideId).populate("pdfFile");
    if (!guide) {
      console.warn(`pdf.view: guide not found for id=${guideId}`);
      return res.status(404).json({ error: "Guide not found" });
    }

    // 🔐 Check purchase via Purchase collection
    const userId = req.user.id || req.user._id;

    const purchased = await Purchase.findOne({
      user: userId,
      guide: guideId,
      status: "completed",
    });

    if (!purchased) {
      console.warn(
        `pdf.view: purchase check failed for guide=${guideId} user=${userId}`
      );
      return res
        .status(403)
        .json({ error: "You must purchase this guide to view it" });
    }

    // ─────────────────────────────────────────
    // 1️⃣ Try PdfFile-based local storage first
    // ─────────────────────────────────────────
    let filename = null;

    // If pdfFile is populated object with filename
    if (guide.pdfFile && typeof guide.pdfFile === "object" && guide.pdfFile.filename) {
      filename = guide.pdfFile.filename;
    }

    // If pdfFile is present but not populated (ObjectId), fetch it
    if (!filename && guide.pdfFile) {
      try {
        const pdfDoc = await PdfFile.findById(guide.pdfFile);
        if (pdfDoc && pdfDoc.filename) filename = pdfDoc.filename;
      } catch (err) {
        console.warn("pdf.view: failed to load PdfFile doc", err.message);
      }
    }

    // ─────────────────────────────────────────
    // 2️⃣ Fallback: pdfUrl field on Guide
    //    - If it is http/https → fetch remote PDF
    //    - Else treat as local filename
    // ─────────────────────────────────────────
    if (!filename && guide.pdfUrl) {
      // Remote PDF (like your w3 dummy link)
      if (
        guide.pdfUrl.startsWith("http://") ||
        guide.pdfUrl.startsWith("https://")
      ) {
        console.log(`pdf.view: streaming remote pdfUrl=${guide.pdfUrl}`);

        try {
          const remoteRes = await axios.get(guide.pdfUrl, {
            responseType: "arraybuffer",
          });

          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", "inline; filename=guide.pdf");

          return res.send(remoteRes.data);
        } catch (err) {
          console.error("pdf.view: failed to fetch remote pdfUrl", err.message);
          return res
            .status(502)
            .json({ error: "Failed to fetch remote PDF file" });
        }
      }

      // Not a full URL → assume it's a filename/path
      filename = path.basename(guide.pdfUrl);
    }

    // ─────────────────────────────────────────
    // 3️⃣ Local file from uploads/
    // ─────────────────────────────────────────
    if (!filename) {
      console.warn(`pdf.view: no pdf attached to guide id=${guideId}`);
      return res.status(404).json({ error: "No PDF attached to this guide" });
    }

    const filePath = path.join(uploadDir, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`pdf.view: file missing on disk path=${filePath}`);
      return res.status(404).json({ error: "PDF missing on server" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error("view pdf error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
