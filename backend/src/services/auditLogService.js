const AuditLog = require("../models/AuditLog");

const logAction = async ({
  action,
  resourceType,
  resourceId,
  boardId,
  userId,
  organizationId,
  details = {},
}) => {
  try {
    await AuditLog.create({
      action,
      resourceType,
      resourceId,
      boardId,
      userId,
      organizationId,
      details,
    });
  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
};

module.exports = logAction;