const express = require("express");
const { uploadItem, getAllItems } = require("../controllers/itemController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../cloudinary"); // multer setup

const router = express.Router();

router.post("/", protect, upload.single("image"), uploadItem);
router.get("/", getAllItems);

module.exports = router;
