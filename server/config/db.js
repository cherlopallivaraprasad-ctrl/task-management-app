import mongoose from 'mongoose';

/**
 * Connects to MongoDB database using Mongoose.
 * Logs success or graceful error messages for beginner-friendly debugging.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow');
    console.log(`✅ MongoDB Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Make sure your local MongoDB service is running or provide a valid MONGO_URI in .env');
    // Exit process with failure
    process.exit(1);
  }
};
