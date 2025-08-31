const Item = require("../models/itemModel");

// Upload new item
exports.uploadItem = async (req, res) => {
  try {
    const { name, description, category, mobile, coordinates } = req.body;

    // ✅ Validate required fields
    if (!name || !description || !category || !mobile || !coordinates) {
      return res.status(400).json({ 
        message: "All fields are required (name, description, category, mobile, coordinates)" 
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
        message: "Invalid coordinates format. Must be JSON like {\"latitude\":12,\"longitude\":77}" 
      });
    }

    if (!parsedCoordinates.latitude || !parsedCoordinates.longitude) {
      return res.status(400).json({ message: "Coordinates must include latitude and longitude" });
    }

    // ✅ Debug: Log file info if present
    console.log("📂 File received:", req.file ? req.file.originalname : "No file uploaded");

    // ✅ Handle image (Cloudinary or local)
    const imageUrl = req.file ? req.file.path : null;

    if (imageUrl) {
      console.log("✅ Cloudinary Upload Success:", imageUrl);
    } else {
      console.log("⚠️ No image uploaded for this item");
    }

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
    console.log("✅ Item saved successfully:", item._id);

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
    console.error("❌ Fetch Items Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};
