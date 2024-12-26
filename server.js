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
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
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






// import express from 'express';
// import dotenv from 'dotenv';
// import connectDB from './db.js';

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.json());

// // Test MongoDB connection before every request
// app.use(async (req, res, next) => {
//   try {
//     await connectDB();
//     next();
//   } catch (error) {
//     console.error('Database connection error:', error.message);
//     res.status(500).json({ message: 'Database connection failed' });
//   }
// });

// // Root route
// app.get('/', (req, res) => {
//   try {
//     res.send('Bus Timetable Server is running');
//   } catch (error) {
//     console.error('Error in root route:', error.message);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Other routes
// app.get('/buses/search', async (req, res) => {
//   try {
//     const { source, destination } = req.query;
//     console.log('Received query:', { source, destination });

//     const buses = await Bus.find({
//       stops: { $elemMatch: { name: source } },
//     });

//     const filteredBuses = buses.filter((bus) => {
//       const stopNames = bus.stops.map((stop) => stop.name);
//       const sourceIndex = stopNames.indexOf(source);
//       const destinationIndex = stopNames.indexOf(destination);
//       return sourceIndex !== -1 && destinationIndex !== -1 && sourceIndex < destinationIndex;
//     });

//     res.json(filteredBuses);
//   } catch (error) {
//     console.error('Error in /buses/search route:', error.message);
//     res.status(500).json({ message: 'Error fetching buses' });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
