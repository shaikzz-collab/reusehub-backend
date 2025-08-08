require('dotenv').config();
const path = require("path");

const connectDB = require("./config/db");
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
connectDB();
// Middleware
app.use(cors()); // Enable CORS for frontend access
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Parse JSON bodies

// Import routes
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/items', require('./routes/itemRoutes'));
app.post('/api/items/upload', upload.single('image'), uploadItem);
const upload = require('../middleware/uploadMiddleware');
const { uploadItem } = require('./controllers/itemController');

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Default route
app.get('/', (req, res) => {
  res.send('ReUseHub API is running...');
});

// Start server on 192.168.1.100 for LAN access
const PORT = process.env.PORT || 5000;
const HOST = '192.168.1.100'; // Your local IP

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
