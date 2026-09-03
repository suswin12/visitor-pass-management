const express = require("express");

const {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  toggleEmployeeStatus,
} = require("../controllers/employeeController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

// ============================================
// GET EMPLOYEES
// Administrator + Receptionist
// ============================================

router.get("/", authorize("administrator", "receptionist"), getEmployees);

// ============================================
// GET SINGLE EMPLOYEE
// Administrator + Receptionist
// ============================================

router.get("/:id", authorize("administrator", "receptionist"), getEmployee);

// ============================================
// ADMIN ONLY
// ============================================

router.post("/", authorize("administrator"), createEmployee);

router.put("/:id", authorize("administrator"), updateEmployee);

router.patch("/:id/status", authorize("administrator"), toggleEmployeeStatus);

module.exports = router;
