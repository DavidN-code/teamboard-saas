const AuditLog = require("../models/AuditLog");

// GET audit logs (owner/admin only)
exports.getAuditLogs = async (req, res, next) => {
  try {
    const { action, resourceType, boardId } = req.query;

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

    if (boardId) {
      query.boardId = boardId;
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

// GET activity for a specific task
exports.getTaskActivity = async (req, res, next) => {
  try {
    const logs = await AuditLog.find({
      organizationId: req.user.organizationId,
      resourceId: req.params.taskId,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    next(error);
  }
};