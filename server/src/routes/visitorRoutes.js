const express = require("express");

const {
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
} = require("../controllers/visitorController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// All visitor routes require authentication
router.use(protect);

// =====================================================
// RECEPTIONIST DASHBOARD
// GET /api/visitors/receptionist/dashboard
// =====================================================
router.get(
  "/receptionist/dashboard",
  authorize("receptionist"),
  getReceptionistDashboard,
);

// =====================================================
// CREATE VISITOR
// POST /api/visitors
// Receptionist only
// =====================================================
router.post("/", authorize("receptionist"), createVisitor);

// =====================================================
// GET ALL VISITORS
// GET /api/visitors
// Administrator + Receptionist
// =====================================================
router.get("/", authorize("administrator", "receptionist"), getVisitors);

// =====================================================
// EMPLOYEE - MY VISITOR REQUESTS
// GET /api/visitors/my-requests
// Employee only
// =====================================================
router.get("/my-requests", authorize("employee"), getMyVisitorRequests);

// =====================================================
// APPROVE VISITOR
// PATCH /api/visitors/:id/approve
// Employee only
// =====================================================
router.patch("/:id/approve", authorize("employee"), approveVisitor);

// =====================================================
// REJECT VISITOR
// PATCH /api/visitors/:id/reject
// Employee only
// =====================================================
router.patch("/:id/reject", authorize("employee"), rejectVisitor);

// =====================================================
// CHECK IN
// PATCH /api/visitors/:id/check-in
// Receptionist only
// =====================================================
router.patch("/:id/check-in", authorize("receptionist"), checkInVisitor);

// =====================================================
// CHECK OUT
// PATCH /api/visitors/:id/check-out
// Receptionist only
// =====================================================
router.patch("/:id/check-out", authorize("receptionist"), checkOutVisitor);

// =====================================================
// CANCEL VISITOR
// PATCH /api/visitors/:id/cancel
// Receptionist only
// =====================================================
router.patch("/:id/cancel", authorize("receptionist"), cancelVisitor);

// =====================================================
// GET SINGLE VISITOR
// GET /api/visitors/:id
// Admin + Receptionist + Employee
// =====================================================
router.get(
  "/:id",
  authorize("administrator", "receptionist", "employee"),
  getVisitor,
);

module.exports = router;
