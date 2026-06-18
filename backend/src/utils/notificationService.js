const Notification = require("../models/Notification");

const createNotification = async ({
  userId,
  organizationId,
  type,
  message,
}) => {
  return Notification.create({
    userId,
    organizationId,
    type,
    message,
  });
};

module.exports = createNotification;