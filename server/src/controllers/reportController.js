const Visitor = require("../models/Visitor");

const getDateRange = (type, startDate, endDate) => {
  const now = new Date();

  let start;
  let end;

  if (type === "today") {
    start = new Date(now);
    start.setHours(0, 0, 0, 0);

    end = new Date(now);
    end.setHours(23, 59, 59, 999);
  } else if (type === "week") {
    start = new Date(now);
    const day = start.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    start.setDate(start.getDate() + diff);
    start.setHours(0, 0, 0, 0);

    end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  } else if (type === "custom") {
    if (!startDate || !endDate) {
      return null;
    }

    start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
  } else {
    return null;
  }

  return { start, end };
};

const getVisitorReport = async (req, res) => {
  try {
    const { type = "today", startDate, endDate } = req.query;

    const range = getDateRange(type, startDate, endDate);

    if (!range) {
      return res.status(400).json({
        success: false,
        message: "Valid report date range is required",
      });
    }

    const { start, end } = range;

    const visitors = await Visitor.find({
      visitDate: {
        $gte: start,
        $lte: end,
      },
    });

    const statistics = {
      totalVisitors: visitors.length,

      pending: visitors.filter((visitor) => visitor.status === "pending")
        .length,

      approved: visitors.filter((visitor) => visitor.status === "approved")
        .length,

      rejected: visitors.filter((visitor) => visitor.status === "rejected")
        .length,

      checkedIn: visitors.filter((visitor) => visitor.status === "checked_in")
        .length,

      checkedOut: visitors.filter((visitor) => visitor.status === "checked_out")
        .length,

      cancelled: visitors.filter((visitor) => visitor.status === "cancelled")
        .length,
    };

    const completedVisits = statistics.checkedOut + statistics.checkedIn;

    const approvalRate =
      statistics.totalVisitors > 0
        ? Math.round(
            ((statistics.approved +
              statistics.checkedIn +
              statistics.checkedOut) /
              statistics.totalVisitors) *
              100,
          )
        : 0;

    res.status(200).json({
      success: true,
      range: {
        start,
        end,
      },
      statistics: {
        ...statistics,
        completedVisits,
        approvalRate,
      },
    });
  } catch (error) {
    console.error("Get visitor report error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getVisitorReport,
};
