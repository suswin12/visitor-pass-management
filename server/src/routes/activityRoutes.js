const express = require("express");

const {
  getActivityLogs,
  getActivityLog,
} = require("../controllers/activityController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Activity history is Administrator only
router.use(protect, authorize("administrator"));

router.get("/", getActivityLogs);

router.get("/:id", getActivityLog);

module.exports = router;
