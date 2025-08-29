import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";

dotenv.config();
const app = express();

// ✅ Connect DB
connectDB();

// ✅ Middleware
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cors());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("🌱 ReUseHub API is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
