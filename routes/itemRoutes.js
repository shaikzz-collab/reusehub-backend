const express = require('express');
const router = express.Router();
const { uploadItem, getAllItems } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../cloudinary'); // multer setup with Cloudinary

// POST /api/items → protected route with image upload
router.post('/', protect, upload.single('image'), uploadItem);

// GET /api/items → fetch all items
router.get('/', getAllItems);

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Item routes working' });
});

module.exports = router;
