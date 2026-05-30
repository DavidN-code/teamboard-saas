const AuditLog = require("../models/AuditLog");

// GET audit logs (owner/admin only)
exports.getAuditLogs = async (req, res, next) => {
  try {
    const { action, resourceType } = req.query;

    const limit = parseInt(req.query.limit) || 100;

    const query = {
      organizationId: req.user.organizationId,
    };

    if (action) {
      query.action = action;
    }

    if (resourceType) {
      query.resourceType = resourceType;
    }

    const logs = await AuditLog.find(query)
      .populate("userId", "name email") // 👈 THIS IS THE FIX
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(logs);

  } catch (error) {
    next(error);
  }
};