// routes/guides.js
const express = require("express");
const Guide = require("../models/guide");
const router = express.Router();

// ⬇️ NEW: extra imports for Cloudinary + file upload
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("../config/cloudinary"); // ✅ correct import

// If you already have auth middleware and it exports { protect },
// you can uncomment this. For now I keep it commented to avoid crashes.
// const { protect } = require("../Middleware/auth");

// temp folder for uploaded PDFs
const upload = multer({ dest: "tmp/" });

/* 
=================================
   CREATE A NEW GUIDE (POST)
=================================
*/
router.post("/", async (req, res) => {
  try {
    const guide = new Guide(req.body);
    await guide.save();
    res.status(201).json({ message: "Guide created successfully", guide });
  } catch (error) {
    console.error("Guide creation error:", error);
    res.status(500).json({ error: "Failed to create guide" });
  }
});

/* 
=================================
      GET ALL GUIDES (GET)
=================================
*/
router.get("/", async (req, res) => {
  try {
    const guides = await Guide.find();
    res.json(guides);
  } catch (error) {
    console.error("Get guides error:", error);
    res.status(500).json({ error: "Failed to fetch guides" });
  }
});

/* 
=================================
     GET SINGLE GUIDE (GET)
=================================
*/
router.get("/:id", async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);

    if (!guide) return res.status(404).json({ error: "Guide not found" });

    res.json(guide);
  } catch (error) {
    console.error("Guide get error:", error);
    res.status(500).json({ error: "Failed to fetch guide" });
  }
});

/* 
=================================
       UPDATE GUIDE (PUT)
=================================
*/
router.put("/:id", async (req, res) => {
  try {
    const guide = await Guide.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!guide) return res.status(404).json({ error: "Guide not found" });

    res.json({ message: "Guide updated successfully", guide });
  } catch (error) {
    console.error("Guide update error:", error);
    res.status(500).json({ error: "Failed to update guide" });
  }
});

/* 
=================================
       DELETE GUIDE (DELETE)
=================================
*/
router.delete("/:id", async (req, res) => {
  try {
    const guide = await Guide.findByIdAndDelete(req.params.id);

    if (!guide) return res.status(404).json({ error: "Guide not found" });

    res.json({ message: "Guide deleted successfully" });
  } catch (error) {
    console.error("Guide delete error:", error);
    res.status(500).json({ error: "Failed to delete guide" });
  }
});

/* 
=================================
    UPLOAD PDF FOR A GUIDE
=================================
*/
// POST /api/guides/:id/upload-pdf
router.post(
  "/:id/upload-pdf",
  // protect,                // 🔒 enable later when auth is ready
  upload.single("file"),     // "file" is the form-data field name
  async (req, res) => {
    try {
      const guideId = req.params.id;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // 1️⃣ upload to Cloudinary as RAW file
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "raw",
        folder: "guides_pdfs",
      });

      // 2️⃣ remove temp file
      fs.unlinkSync(req.file.path);

      // 3️⃣ save URL + publicId into Guide
      const guide = await Guide.findById(guideId);
      if (!guide) {
        return res.status(404).json({ error: "Guide not found" });
      }

      guide.pdfUrl = result.secure_url;
      guide.pdfPublicId = result.public_id;
      await guide.save();

      res.json({
        message: "PDF uploaded and linked to guide",
        guide,
      });
    } catch (error) {
      console.error("Upload PDF error:", error);
      res.status(500).json({ error: "Failed to upload PDF" });
    }
  }
);

/* 
=================================
   GET SECURE PDF URL (PAID)
=================================
*/
// GET /api/guides/:id/secure-pdf
router.get("/:id/secure-pdf", async (req, res) => {
  try {
    const guideId = req.params.id;

    const guide = await Guide.findById(guideId);

    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }

    // 🔐 TODO: when auth is ready, check purchasedBy & user
    // Example later (when protect is enabled):
    //
    // const userId = req.user._id;
    // const hasPurchased = guide.purchasedBy.some(
    //   (uid) => uid.toString() === userId.toString()
    // );
    // if (!hasPurchased) {
    //   return res.status(403).json({
    //     error: "Access denied. You have not purchased this guide.",
    //   });
    // }

    if (!guide.pdfUrl) {
      return res.status(404).json({
        error: "No PDF attached to this guide.",
      });
    }

    res.json({ url: guide.pdfUrl });
  } catch (error) {
    console.error("Secure PDF error:", error);
    res.status(500).json({ error: "Failed to fetch secure PDF" });
  }
});

module.exports = router;
