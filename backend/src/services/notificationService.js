const Notification = require("../models/Notification");

const createNotification = async ({
  userId,
  organizationId,
  type,
  resourceId,
  message,
}) => {
  return Notification.create({
    userId,
    organizationId,
    type,
    resourceId,
    message,
  });
};

module.exports = createNotification;