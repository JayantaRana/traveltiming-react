require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const busRoutes = require('./routes/busRoutes'); // Import the routes

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI ;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true,serverSelectionTimeoutMS: 30000 })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/buses', busRoutes); // All routes related to buses

// Root Route for Health Check
app.get('/', (req, res) => {
  res.send('Bus Timetable Server is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
