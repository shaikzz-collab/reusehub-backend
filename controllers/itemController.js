const Item = require("../models/itemModel");

// Upload new item
exports.uploadItem = async (req, res) => {
  try {
    const { name, description, category, mobile, coordinates } = req.body;

    // ✅ Validate required fields
    if (!name || !description || !category || !mobile || !coordinates) {
      return res.status(400).json({
        message:
          "All fields are required (name, description, category, mobile, coordinates)",
      });
    }

    // ✅ Parse coordinates safely
    let parsedCoordinates;
    try {
      parsedCoordinates =
        typeof coordinates === "string"
          ? JSON.parse(coordinates) // if sent as string
          : coordinates; // if already object
    } catch (e) {
      return res.status(400).json({
        message:
          "Invalid coordinates format. Must be JSON like {\"latitude\":12,\"longitude\":77}",
      });
    }

    if (!parsedCoordinates.latitude || !parsedCoordinates.longitude) {
      return res
        .status(400)
        .json({ message: "Coordinates must include latitude and longitude" });
    }

    // ✅ Debug logs
    console.log("🟢 Uploading item...");
    console.log("➡️ Body:", req.body);
    console.log("➡️ File received:", req.file);

    // ✅ Handle image from Cloudinary (path is returned)
    const imageUrl = req.file ? req.file.path : null;

    const item = new Item({
      name,
      description,
      category,
      mobile,
      coordinates: parsedCoordinates,
      imageUrl,
      user: req.user.id,
    });

    await item.save();

    console.log("✅ Item saved:", item);

    res.status(201).json(item);
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate("user", "name email");
    res.json(items);
  } catch (err) {
    console.error("❌ Fetch Items Error:", err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ✅ Ensure only owner can update
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // ✅ Update text fields
    item.name = req.body.name || item.name;
    item.description = req.body.description || item.description;
    item.category = req.body.category || item.category;
    item.mobile = req.body.mobile || item.mobile;

    // ✅ If new image uploaded, update it
    if (req.file && req.file.path) {
      item.image = req.file.path; // Cloudinary URL
    } else if (req.body.image) {
      // fallback if user provides URL
      item.image = req.body.image;
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
