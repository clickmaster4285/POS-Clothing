const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Database connected");
  } catch (error) {
    console.error("❌ DB connection failed", error);
    process.exit(1);
  }
};
