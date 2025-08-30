const Item = require("../models/itemModel");

exports.uploadItem = async (req, res) => {
  try {
    const { name, description, category, mobile, coordinates } = req.body;

    const item = new Item({
      name,
      description,
      category,
      mobile,
      coordinates: JSON.parse(coordinates),
      imageUrl: req.file?.path,
      user: req.user.id,
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate("user", "name email");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
