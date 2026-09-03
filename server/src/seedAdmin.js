require("dotenv").config();

const connectDB = require("./config/db");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      role: "administrator",
    });

    if (existingAdmin) {
      console.log("Administrator already exists.");
      process.exit(0);
    }

    const admin = await User.create({
      name: "System Administrator",
      email: "admin@visitorpass.com",
      password: "Admin@12345",
      role: "administrator",
      isActive: true,
    });

    console.log("Administrator created successfully.");
    console.log("Email:", admin.email);

    process.exit(0);
  } catch (error) {
    console.error("Admin seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
