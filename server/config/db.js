const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lexiai');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log('Running in Standalone Mode (MongoDB Offline)');
  }
};

module.exports = connectDB;