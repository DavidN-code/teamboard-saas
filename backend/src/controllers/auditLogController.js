const AuditLog = require("../models/AuditLog");

// GET audit logs (owner/admin only)
exports.getAuditLogs = async (req, res, next) => {
  try {
    const { action, resourceType } = req.query;

    // Base query: only logs from user's organization
    const query = {
      organizationId: req.user.organizationId,
    };

    // Optional filters
    if (action) {
      query.action = action;
    }

    if (resourceType) {
      query.resourceType = resourceType;
    }

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 }) // newest first
      .limit(100); // prevent huge responses

    res.json(logs);

  } catch (error) {
    next(error);
  }
};