// const express = require("express");
// const { login } = require("../controllers/authController");

// const router = express.Router();

// router.post("/login", login);

// module.exports = router;
const express = require("express");

const { login, getMe, logout } = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Login
router.post("/login", login);

// Get currently logged-in user
router.get("/me", protect, getMe);

// Logout
router.post("/logout", protect, logout);

module.exports = router;