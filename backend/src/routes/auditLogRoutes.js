const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const { getAuditLogs } = require("../controllers/auditLogController");

// Protected route
router.get(
  "/",
  authMiddleware,
  allowRoles("owner", "admin"),
  getAuditLogs
);

module.exports = router;