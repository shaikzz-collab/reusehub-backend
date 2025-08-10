const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const uploadMiddleware = require('./middleware/uploadMiddleware'); // confirm if you still need this or using cloudinary upload

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route for quick check
app.get('/api/test', (req, res) => {
  res.json({ message: 'API test route working' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/items/upload', itemRoutes);
// If you still want this separate upload route (optional, as handled in itemRoutes now)
// app.post('/api/items/upload', uploadMiddleware.single('image'), uploadItem);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser and useUnifiedTopology deprecated in new drivers, so can be removed
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
