const express = require("express");

const { getAdminDashboard } = require("../controllers/dashboardController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/admin", protect, authorize("administrator"), getAdminDashboard);

module.exports = router;
