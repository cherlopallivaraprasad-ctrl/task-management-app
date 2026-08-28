import mongoose from 'mongoose';

let isConnected = false;

/**
 * Connects to MongoDB database using Mongoose.
 * Supports both persistent servers and serverless environments (like Vercel).
 */
export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow'
    );
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (process.env.NODE_ENV !== 'production') {
      console.error('Make sure your MongoDB service is running or provide a valid MONGO_URI in .env');
    }
  }
};
