import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    mobile: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"],
    },
    imageUrl: { type: String },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;
