const Notification = require("../models/Notification");

// GET notifications for current user
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.userId,
      organizationId: req.user.organizationId,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// MARK notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
        organizationId: req.user.organizationId,
      },
      {
        read: true,
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    next(error);
  }
};

// MARK ALL notifications as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      {
        userId: req.user.userId,
        organizationId: req.user.organizationId,
        read: false,
      },
      {
        read: true,
      }
    );

    res.json({
      message: "All notifications marked as read",
    });

  } catch (error) {
    next(error);
  }
};