const Item = require('../models/itemModel');

const uploadItem = async (req, res) => {
  try {
    const { name, description, category, coordinates } = req.body;

    if (!name || !description || !category || !coordinates) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const parsedCoordinates = JSON.parse(coordinates);

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newItem = new Item({
      name,
      description,
      category,
      imageUrl,
      coordinates: {
        latitude: parseFloat(parsedCoordinates.latitude),
        longitude: parseFloat(parsedCoordinates.longitude),
      },
      user: req.userId,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ message: 'Server error during upload' });
  }
};



const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching items' });
  }
};




// @desc    Get a single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('user', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    console.error('Get Item Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching item' });
  }
};

// @desc    Delete an item (if owned by user)
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Ensure the user deleting is the owner
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this item' });
    }

    await item.remove();
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete Item Error:', error.message);
    res.status(500).json({ message: 'Server error while deleting item' });
  }
};

// @desc    Get items uploaded by current user
// @route   GET /api/items/my
// @access  Private
const getUserItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id });
    res.status(200).json(items);
  } catch (error) {
    console.error('User Items Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching user items' });
  }
};

module.exports = {
  uploadItem,
  getAllItems,
  getItemById,
  deleteItem,
  getUserItems,
};
