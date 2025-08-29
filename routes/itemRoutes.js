const express = require("express");
const router = express.Router();
const { uploadItem, getAllItems } = require("../controllers/itemController");
const { deleteItem } = require("../controllers/itemController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../cloudinary");

// POST → upload item
router.post("/", protect, upload.single("image"), uploadItem);

// GET → all items
router.get("/", getAllItems);

// DELETE → remove item
router.delete("/:id", protect, deleteItem);

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Item routes working" });
});

module.exports = router;
