const express = require('express');
const router = express.Router();
const { uploadItem, getAllItems } = require('../controllers/itemController'); // ✅ Make sure this path is correct
const { protect } = require('../middleware/authMiddleware');
const upload = require('../cloudinary'); // Use new cloudinary upload

// POST /api/items/upload → protected, with file upload
router.post('/uploadS', protect, upload.single('image'), uploadItem);

// GET /api/items → fetch all items
router.get('/', getAllItems); // ✅ getAllItems must be a function

module.exports = router;
