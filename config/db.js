const mongoose = require('mongoose');
const db = process.env.MONGODB_URL

const connectDB = async () => {
  try {
    await mongoose.connect(db, {});

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;