const Item = require("../models/itemModel");

// ✅ Upload Item
const uploadItem = async (req, res) => {
  try {
    const { name, description, category, mobile, coordinates } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image is required" });
    }

    const parsedCoordinates = JSON.parse(coordinates);

    const newItem = new Item({
      name,
      description,
      category,
      mobile,
      imageUrl: req.file.path, // Cloudinary URL
      coordinates: {
        latitude: parsedCoordinates.lat,
        longitude: parsedCoordinates.lng,
      },
      user: req.user._id,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("❌ Error uploading item:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate("user", "name email");
    res.json(items);
  } catch (error) {
    console.error("❌ Error fetching items:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
// Delete an item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Optional: check if the logged-in user is the owner
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await item.deleteOne();
    res.json({ message: "Item removed successfully" });
  } catch (err) {
    console.error("❌ Delete item error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
deleteItem 

module.exports = { uploadItem, getAllItems,deleteItem  };
