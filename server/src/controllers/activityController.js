const ActivityLog = require("../models/ActivityLog");

// Get activity history
const getActivityLogs = async (req, res) => {
  try {
    const { action, visitor, performedBy, startDate, endDate } = req.query;

    const filter = {};

    if (action) {
      filter.action = action;
    }

    if (visitor) {
      filter.visitor = visitor;
    }

    if (performedBy) {
      filter.performedBy = performedBy;
    }

    // Date filter
    if (startDate || endDate) {
    //   filter.performedAt = {};
    filter.createdAt = {};

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        // filter.performedAt.$gte = start;
        filter.createdAt.$gte = start;

      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        // filter.performedAt.$lte = end;
        filter.createdAt.$lte = end;
      }
    }

    const logs = await ActivityLog.find(filter)
      //   .populate("visitor", "visitorName phone employee visitDate status")
      .populate({
        path: "visitor",
        select: "visitorName phone employee visitDate status",
        populate: {
          path: "employee",
          select: "name employeeId",
        },
      })
      .populate("performedBy", "name email role")
      //   .sort({ performedAt: -1 });
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    console.error("Get activity logs error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get single activity log
const getActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.id)
      .populate("visitor", "visitorName phone employee visitDate status")
      .populate("performedBy", "name email role");

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Activity log not found",
      });
    }

    res.status(200).json({
      success: true,
      log,
    });
  } catch (error) {
    console.error("Get activity log error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getActivityLogs,
  getActivityLog,
};
