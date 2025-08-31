const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Set up storage engine
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "reusehub_items", // folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// ✅ Multer upload middleware
const upload = multer({ storage });

// ✅ Optional debug middleware
const debugUpload = (req, res, next) => {
  console.log("🟢 File received in middleware:", req.file);
  console.log("🟢 Body received:", req.body);
  next();
};

module.exports = { upload, debugUpload };
