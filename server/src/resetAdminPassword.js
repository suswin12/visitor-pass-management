require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const admin = await User.findOne({
      email: "admin@visitorpass.com",
    }).select("+password");

    if (!admin) {
      console.log("Admin user not found");
      process.exit(1);
    }

    admin.password = "Admin@12345";
    admin.isActive = true;

    await admin.save();

    console.log("Admin password reset successfully");
    console.log("Email: admin@visitorpass.com");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Password reset failed:", error.message);
    process.exit(1);
  }
};

resetAdminPassword();
