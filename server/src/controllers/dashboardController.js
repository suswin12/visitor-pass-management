const Visitor = require("../models/Visitor");
const Employee = require("../models/Employee");

const getAdminDashboard = async (req, res) => {
  try {
    const now = new Date();

    // Start of today
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    // End of today
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Start of tomorrow
    const tomorrowStart = new Date(todayEnd);
    tomorrowStart.setMilliseconds(1);

    // Pending visitor requests
    const pendingRequests = await Visitor.countDocuments({
      status: "pending",
    });

    // Today's visitors
    const todaysVisitors = await Visitor.countDocuments({
      visitDate: {
        $gte: todayStart,
        $lte: todayEnd,
      },
      status: {
        $ne: "cancelled",
      },
    });

    // Currently inside
    const currentlyInside = await Visitor.countDocuments({
      status: "checked_in",
    });

    // Total active employees
    const totalEmployees = await Employee.countDocuments({
      isActive: true,
    });

    // Scheduled visitors
    const scheduledVisitors = await Visitor.countDocuments({
      expectedArrival: {
        $gte: tomorrowStart,
      },
      status: {
        $in: ["pending", "approved"],
      },
    });

    return res.status(200).json({
      success: true,
      statistics: {
        pendingRequests,
        todaysVisitors,
        currentlyInside,
        totalEmployees,
        scheduledVisitors,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics",
    });
  }
};

module.exports = {
  getAdminDashboard,
};
