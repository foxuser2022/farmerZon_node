import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

const db = process.env.MONGODB_URL || '';
if (!db) {
  console.error('MONGODB_URL is not defined in environment variables');
  process.exit(1);
}

if (!db.startsWith('mongodb://') && !db.startsWith('mongodb+srv://')) {
  console.error('Invalid MongoDB connection string. Must start with mongodb:// or mongodb+srv://');
  process.exit(1);
}

export const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log('MongoDB Connected Successfully...');
  } catch (err) {
    if (err instanceof Error) {
      console.error('MongoDB Connection Error:', err.message);
    } else {
      console.error('An unknown error occurred while connecting to MongoDB');
    }
    process.exit(1);
  }
}; 