import Item from "../models/itemModel.js";

// @desc Upload a new item
export const uploadItem = async (req, res) => {
  try {
    const { name, description, category, mobile, coordinates } = req.body;

    if (!name || !description || !category || !mobile || !coordinates) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let parsedCoords;
    try {
      parsedCoords =
        typeof coordinates === "string"
          ? JSON.parse(coordinates)
          : coordinates;
    } catch {
      return res.status(400).json({ message: "Invalid coordinates format" });
    }

    const imageUrl = req.file ? req.file.path : null;

    const newItem = new Item({
      name,
      description,
      category,
      mobile,
      imageUrl,
      coordinates: {
        latitude: parsedCoords.lat || parsedCoords.latitude,
        longitude: parsedCoords.lng || parsedCoords.longitude,
      },
      user: req.user.id,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error uploading item:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  uploadItem,
  getAllItems,
};
