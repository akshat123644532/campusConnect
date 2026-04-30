const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB Connected:", conn.connection.host);
  } catch (err) {
    console.log("DB ERROR:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;