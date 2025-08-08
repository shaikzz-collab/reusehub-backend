const Item = require('../models/itemModel');

const uploadItem = async (req, res) => {
  try {
    const { name, description, category, coordinates } = req.body;

    if (!name || !description || !category || !coordinates) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Ensure image is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const newItem = new Item({
      name,
      description,
      category,
      coordinates: JSON.parse(coordinates), // Ensure it's parsed as object
      image: imageUrl,
      user: req.userId,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error uploading item:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = uploadItem;
