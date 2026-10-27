const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recipe_book';
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });

    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failed: ${error.message}`);
    console.warn(`[Database Warning] Please verify MONGODB_URI in backend/.env. Using offline/unconnected mode until DB is reachable.`);
  }
};

module.exports = connectDB;
