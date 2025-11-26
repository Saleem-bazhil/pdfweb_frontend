const express = require("express");
const Guide = require("../models/Guide");
const router = express.Router();

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

module.exports = router;
