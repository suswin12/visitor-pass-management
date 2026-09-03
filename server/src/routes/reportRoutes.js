const express = require("express");

const { getVisitorReport } = require("../controllers/reportController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("administrator"));

router.get("/", getVisitorReport);

module.exports = router;
