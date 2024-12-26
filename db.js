import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log('Reusing existing MongoDB connection');
    return;
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw new Error('Failed to connect to MongoDB');
  }
};

export default connectDB;

