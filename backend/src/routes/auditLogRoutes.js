const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  getAuditLogs,
  getTaskActivity,
} = require("../controllers/auditLogController");

// Organization audit logs
router.get(
  "/",
  authMiddleware,
  allowRoles("owner", "admin"),
  getAuditLogs
);

// Activity for a specific task
router.get(
  "/task/:taskId",
  authMiddleware,
  getTaskActivity
);

module.exports = router;