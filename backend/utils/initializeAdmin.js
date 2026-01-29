const User = require("../models/user.model");

const initializeAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      console.log("👑 Admin already exists");
      return;
    }

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.warn("⚠️ Admin credentials missing in .env");
      return;
    }

    const admin = await User.create({
      name: "Super Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("👑 Admin user created:", admin.email);
  } catch (error) {
    console.error("❌ Failed to create admin:", error.message);
  }
};

module.exports = initializeAdmin;
