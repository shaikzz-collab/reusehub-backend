import express from "express";
import { uploadItem, getAllItems } from "../controllers/itemController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../cloudinary.js"; // multer-storage-cloudinary setup

const router = express.Router();

router.post("/", protect, upload.single("image"), uploadItem);
router.get("/", getAllItems);

router.get("/test", (req, res) => {
  res.json({ message: "Item routes working ✅" });
});

export default router;
