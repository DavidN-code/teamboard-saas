const AuditLog = require("../models/AuditLog");

exports.getActivityFeed = async (req, res, next) => {
  try {
    const activities = await AuditLog.find({
      organizationId: req.user.organizationId,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(activities);
  } catch (error) {
    next(error);
  }
};