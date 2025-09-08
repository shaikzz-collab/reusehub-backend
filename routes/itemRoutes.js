const express = require("express");
const router = express.Router();
const { uploadItem, getAllItems, updateItem } = require("../controllers/itemController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../cloudinary"); // ✅ import directly, not destructure

// POST /api/items → protected route with image upload
router.post("/", protect, upload.single("image"), uploadItem);

// GET /api/items → fetch all items
router.get("/", getAllItems);

// 🧪 Cloudinary test upload route
router.post("/upload-test", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log("✅ File uploaded to Cloudinary:", req.file.path);
    res.json({
      message: "Cloudinary upload successful",
      fileUrl: req.file.path,
      body: req.body,
    });
  } catch (err) {
    console.error("❌ Cloudinary Upload Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Item routes working ✅" });
});
// PUT /api/items/:id → update item (with optional new image)
router.put("/:id", protect, upload.single("image"), updateItem);
module.exports = router;
