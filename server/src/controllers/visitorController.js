const Visitor = require("../models/Visitor");
const Employee = require("../models/Employee");
const { createActivityLog } = require("../services/activityService");

// Helper: start/end of a date
const getDateRange = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// Create visitor request - Receptionist
const createVisitor = async (req, res) => {
  try {
    const {
      visitorName,
      phone,
      email,
      company,
      idProofType,
      idProofNumber,
      employee,
      visitDate,
      expectedArrival,
      purpose,
    } = req.body;

    if (
      !visitorName ||
      !phone ||
      !idProofType ||
      !idProofNumber ||
      !employee ||
      !visitDate ||
      !expectedArrival ||
      !purpose
    ) {
      return res.status(400).json({
        success: false,
        message: "All required visitor fields must be provided",
      });
    }

    const visitDateObj = new Date(visitDate);
    const arrivalObj = new Date(expectedArrival);
    const now = new Date();

    if (
      Number.isNaN(visitDateObj.getTime()) ||
      Number.isNaN(arrivalObj.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit date or arrival time",
      });
    }

    // Rule 3: Visit date cannot be before current date
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const requestedDateStart = new Date(visitDateObj);
    requestedDateStart.setHours(0, 0, 0, 0);

    if (requestedDateStart < todayStart) {
      return res.status(400).json({
        success: false,
        message: "Visit date cannot be before today",
      });
    }

    // Rule 4: If visit is today, arrival cannot be before current time
    if (
      requestedDateStart.getTime() === todayStart.getTime() &&
      arrivalObj < now
    ) {
      return res.status(400).json({
        success: false,
        message: "Expected arrival time cannot be before the current time",
      });
    }

    // Employee must exist and be active
    const employeeDoc = await Employee.findById(employee);

    if (!employeeDoc) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (!employeeDoc.isActive) {
      return res.status(400).json({
        success: false,
        message: "Selected employee is inactive",
      });
    }

    // Rule 5: Employee can have maximum 3 pending requests
    const pendingCount = await Visitor.countDocuments({
      employee,
      status: "pending",
    });

    if (pendingCount >= 3) {
      return res.status(400).json({
        success: false,
        message: "Employee already has 3 pending visitor requests",
      });
    }

    // Rule 2: Duplicate visitor registration on same date
    const { start, end } = getDateRange(visitDateObj);

    const duplicateVisitor = await Visitor.findOne({
      phone,
      visitDate: {
        $gte: start,
        $lte: end,
      },
      status: {
        $ne: "cancelled",
      },
    });

    if (duplicateVisitor) {
      return res.status(409).json({
        success: false,
        message: "Visitor is already registered for this date",
      });
    }

    // Rule 1: Visitor cannot have another active visit
    const activeStatuses = ["pending", "approved", "checked_in"];

    const activeVisit = await Visitor.findOne({
      phone,
      status: {
        $in: activeStatuses,
      },
    });

    if (activeVisit) {
      return res.status(409).json({
        success: false,
        message: "Visitor already has an active visit",
      });
    }

    const visitor = await Visitor.create({
      visitorName,
      phone,
      email,
      company,
      idProofType,
      idProofNumber,
      employee,
      visitDate: visitDateObj,
      expectedArrival: arrivalObj,
      purpose,
      status: "pending",
      createdBy: req.user._id,
    });

    // Activity: Created
    await createActivityLog({
      action: "Created",
      visitor: visitor._id,
      performedBy: req.user._id,
      details: `Visitor request created for ${visitor.visitorName}`,
    });

    const populatedVisitor = await Visitor.findById(visitor._id)
      .populate("employee", "employeeId name department designation")
      .populate("createdBy", "name email role");

    return res.status(201).json({
      success: true,
      message: "Visitor request created successfully",
      visitor: populatedVisitor,
    });
  } catch (error) {
    console.error("Create visitor error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all visitors
const getVisitors = async (req, res) => {
  try {
    const { visitorName, employeeName, visitDate, status, history } = req.query;

    const filter = {};

    // Visitor name search
    if (visitorName) {
      filter.visitorName = {
        $regex: visitorName.trim(),
        $options: "i",
      };
    }

    // Visit date filter
    if (visitDate) {
      const start = new Date(visitDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(visitDate);
      end.setHours(23, 59, 59, 999);

      filter.visitDate = {
        $gte: start,
        $lte: end,
      };
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // History page
    if (history === "true") {
      filter.status = {
        $in: ["checked_out", "rejected", "cancelled"],
      };
    }

    let visitors = await Visitor.find(filter)
      .populate("employee", "name employeeId department")
      .populate("createdBy", "name email role")
      .sort({
        visitDate: -1,
        createdAt: -1,
      });

    // Employee name search
    if (employeeName) {
      const search = employeeName.trim().toLowerCase();

      visitors = visitors.filter((visitor) =>
        visitor.employee?.name?.toLowerCase().includes(search),
      );
    }

    return res.status(200).json({
      success: true,
      count: visitors.length,
      visitors,
    });
  } catch (error) {
    console.error("Get visitors error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get single visitor
const getVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
      .populate("employee", "employeeId name department designation")
      .populate("createdBy", "name email role")
      .populate("approvedBy", "name email role")
      .populate("rejectedBy", "name email role");

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    return res.status(200).json({
      success: true,
      visitor,
    });
  } catch (error) {
    console.error("Get visitor error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Employee: get pending requests assigned to them
// const getMyVisitorRequests = async (req, res) => {
//   try {
//     const employee = await Employee.findOne({
//       user: req.user._id,
//     });

//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: "Employee profile not found",
//       });
//     }

//     const visitors = await Visitor.find({
//       employee: employee._id,
//       status: "pending",
//     })
//       .populate("employee", "employeeId name department designation")
//       .populate("createdBy", "name email role")
//       .sort({
//         expectedArrival: 1,
//       });

//     return res.status(200).json({
//       success: true,
//       count: visitors.length,
//       visitors,
//     });
//   } catch (error) {
//     console.error("Get my visitor requests error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

const getMyVisitorRequests = async (req, res) => {
  try {
    console.log("Logged-in user:", {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    });

    const employee = await Employee.findOne({
      user: req.user._id,
    });

    console.log("Employee found:", employee);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const allPendingVisitors = await Visitor.find({
      status: "pending",
    }).select("visitorName employee status");

    console.log("ALL PENDING VISITORS:", allPendingVisitors);

    const visitors = await Visitor.find({
      employee: employee._id,
      status: "pending",
    })
      .populate("employee", "employeeId name department designation")
      .populate("createdBy", "name email role")
      .sort({
        expectedArrival: 1,
      });

    console.log("Employee ID:", employee._id);
    console.log("Pending visitors:", visitors.length);

    return res.status(200).json({
      success: true,
      count: visitors.length,
      visitors,
    });
  } catch (error) {
    console.error("Get my visitor requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Employee: approve visitor
const approveVisitor = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      user: req.user._id,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (visitor.employee.toString() !== employee._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only approve your own visitor requests",
      });
    }

    if (visitor.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Visitor request cannot be approved from ${visitor.status} status`,
      });
    }

    visitor.status = "approved";
    visitor.approvedBy = req.user._id;
    visitor.approvedAt = new Date();
    visitor.remarks = req.body.remarks || visitor.remarks;

    await visitor.save();

    // Activity: Approved
    await createActivityLog({
      action: "Approved",
      visitor: visitor._id,
      performedBy: req.user._id,
      details: visitor.remarks || "Visitor request approved",
    });

    const populatedVisitor = await Visitor.findById(visitor._id)
      .populate("employee", "employeeId name department designation")
      .populate("createdBy", "name email role")
      .populate("approvedBy", "name email role");

    return res.status(200).json({
      success: true,
      message: "Visitor request approved successfully",
      visitor: populatedVisitor,
    });
  } catch (error) {
    console.error("Approve visitor error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Employee: reject visitor
const rejectVisitor = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      user: req.user._id,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (visitor.employee.toString() !== employee._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only reject your own visitor requests",
      });
    }

    if (visitor.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Visitor request cannot be rejected from ${visitor.status} status`,
      });
    }

    visitor.status = "rejected";
    visitor.rejectedBy = req.user._id;
    visitor.rejectedAt = new Date();
    visitor.remarks = req.body.remarks || visitor.remarks;

    await visitor.save();

    // Activity: Rejected
    await createActivityLog({
      action: "Rejected",
      visitor: visitor._id,
      performedBy: req.user._id,
      details: visitor.remarks || "Visitor request rejected",
    });

    const populatedVisitor = await Visitor.findById(visitor._id)
      .populate("employee", "employeeId name department designation")
      .populate("createdBy", "name email role")
      .populate("rejectedBy", "name email role");

    return res.status(200).json({
      success: true,
      message: "Visitor request rejected successfully",
      visitor: populatedVisitor,
    });
  } catch (error) {
    console.error("Reject visitor error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Receptionist: check in visitor
const checkInVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    // Rule 7
    if (visitor.status === "checked_in") {
      return res.status(400).json({
        success: false,
        message: "Visitor is already checked in",
      });
    }

    // Rule 9
    if (visitor.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Rejected visitor cannot be checked in",
      });
    }

    // Rule 10
    if (visitor.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled visitor cannot be checked in",
      });
    }

    // Rule 6
    if (visitor.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Visitor must be approved before check-in",
      });
    }

    visitor.status = "checked_in";
    visitor.checkInTime = new Date();
    visitor.checkOutTime = null;

    await visitor.save();

    // Activity: Checked In
    await createActivityLog({
      action: "Checked In",
      visitor: visitor._id,
      performedBy: req.user._id,
      details: "Visitor checked in successfully",
    });

    return res.status(200).json({
      success: true,
      message: "Visitor checked in successfully",
      visitor,
    });
  } catch (error) {
    console.error("Check-in visitor error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Receptionist: check out visitor
const checkOutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (visitor.status !== "checked_in" || !visitor.checkInTime) {
      return res.status(400).json({
        success: false,
        message: "Visitor is not currently checked in",
      });
    }

    const checkOutTime = new Date();

    // Rule 8
    if (checkOutTime <= visitor.checkInTime) {
      return res.status(400).json({
        success: false,
        message: "Checkout time must be later than check-in time",
      });
    }

    visitor.checkOutTime = checkOutTime;
    visitor.status = "checked_out";

    await visitor.save();

    // Activity: Checked Out
    await createActivityLog({
      action: "Checked Out",
      visitor: visitor._id,
      performedBy: req.user._id,
      details: "Visitor checked out successfully",
    });

    return res.status(200).json({
      success: true,
      message: "Visitor checked out successfully",
      visitor,
    });
  } catch (error) {
    console.error("Check-out visitor error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Cancel visitor request
const cancelVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (["checked_in", "checked_out"].includes(visitor.status)) {
      return res.status(400).json({
        success: false,
        message: "Checked-in or completed visits cannot be cancelled",
      });
    }

    visitor.status = "cancelled";

    await visitor.save();

    // Activity: Cancelled
    await createActivityLog({
      action: "Cancelled",
      visitor: visitor._id,
      performedBy: req.user._id,
      details: "Visitor visit cancelled",
    });

    return res.status(200).json({
      success: true,
      message: "Visitor visit cancelled successfully",
      visitor,
    });
  } catch (error) {
    console.error("Cancel visitor error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Receptionist Dashboard
const getReceptionistDashboard = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [pendingRequests, todayVisitors, currentlyInside, scheduledVisitors] =
      await Promise.all([
        // Pending employee approval requests
        Visitor.countDocuments({
          status: "pending",
        }),

        // Today's visitors
        // Cancelled visits are excluded
        Visitor.countDocuments({
          visitDate: {
            $gte: startOfToday,
            $lte: endOfToday,
          },
          status: {
            $ne: "cancelled",
          },
        }),

        // Visitors currently inside
        Visitor.countDocuments({
          status: "checked_in",
        }),

        // Future scheduled visitors
        Visitor.countDocuments({
          visitDate: {
            $gt: endOfToday,
          },
          status: {
            $in: ["pending", "approved"],
          },
        }),
      ]);

    return res.status(200).json({
      success: true,
      dashboard: {
        pendingRequests,
        todayVisitors,
        currentlyInside,
        scheduledVisitors,
      },
    });
  } catch (error) {
    console.error("Get receptionist dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createVisitor,
  getVisitors,
  getVisitor,
  getMyVisitorRequests,
  approveVisitor,
  rejectVisitor,
  checkInVisitor,
  checkOutVisitor,
  cancelVisitor,
  getReceptionistDashboard,
};
