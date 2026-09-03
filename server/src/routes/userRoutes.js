const express = require("express");

const {
  createUser,
  getUsers,
  getUser,
  toggleUserStatus,
  updateUserRole,
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Administrator only
router.use(protect, authorize("administrator"));

router.post("/", createUser);

router.get("/", getUsers);

router.get("/:id", getUser);

router.patch("/:id/status", toggleUserStatus);

router.patch("/:id/role", updateUserRole);



module.exports = router;
