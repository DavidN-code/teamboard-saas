const AuditLog = require("../models/AuditLog");
const pusher = require("./pusherService");

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
    const auditLog = await AuditLog.create({
      action,
      resourceType,
      resourceId,
      boardId,
      userId,
      organizationId,
      details,
    });

    // Notify connected clients that activity changed
    if (boardId) {
      await pusher.trigger(
        `board-${boardId}`,
        "activity-updated",
        {}
      );
    }

    return auditLog;

  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
};

module.exports = logAction;