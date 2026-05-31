const AuditLog = require("../models/AuditLog");

// GET audit logs (owner/admin only)
exports.getAuditLogs = async (req, res, next) => {
  try {
    const { action, resourceType } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

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
  .populate("userId", "name email")
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

  const total = await AuditLog.countDocuments(query);

  res.json({
    logs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });

  } catch (error) {
    next(error);
  }
};