const AuditLog = require("../models/AuditLog");

exports.getActivityFeed = async (req, res, next) => {
  try {
    const query = {
      organizationId: req.user.organizationId,
    };
    
    if (req.query.boardId) {
      query.boardId = req.query.boardId;
    }
    
    const activities = await AuditLog.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(activities);
  } catch (error) {
    next(error);
  }
};