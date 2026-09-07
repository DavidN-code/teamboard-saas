const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  getUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

// Owner/Admin can view members
router.get(
  "/",
  authMiddleware,
  allowRoles("owner", "admin"),
  getUsers
);

// Owner only can change roles
router.put(
  "/:id/role",
  authMiddleware,
  allowRoles("owner"),
  updateUserRole
);

// Owner only can remove users
router.delete(
  "/:id",
  authMiddleware,
  allowRoles("owner"),
  deleteUser
);

module.exports = router;