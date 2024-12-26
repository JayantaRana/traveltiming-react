// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const busRoutes = require('./routes/busRoutes'); // Import the routes

// const app = express();
// const PORT = process.env.PORT || 3000;
// const MONGODB_URI = process.env.MONGODB_URI ;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose
//   .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true,serverSelectionTimeoutMS: 30000 })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Routes
// app.use('/buses', busRoutes); // All routes related to buses

// // Root Route for Health Check
// app.get('/', (req, res) => {
//   res.send('Bus Timetable Server is running');
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });






import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js'; // Import the new connection file
import Bus from './models/Bus.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB at the start of each request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Search route
app.get('/buses/search', async (req, res) => {
  try {
    const { source, destination } = req.query;

    console.log('Query received:', { source, destination });

    const buses = await Bus.find({
      stops: {
        $elemMatch: { name: source },
      },
    });

    // Filter buses where the destination exists after the source
    const filteredBuses = buses.filter((bus) => {
      const stopNames = bus.stops.map((stop) => stop.name);
      const sourceIndex = stopNames.indexOf(source);
      const destinationIndex = stopNames.indexOf(destination);
      return sourceIndex !== -1 && destinationIndex !== -1 && sourceIndex < destinationIndex;
    });

    console.log('Filtered Buses:', filteredBuses);

    res.json(filteredBuses);
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Bus Timetable Server is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

