const Notification = require("../models/Notification");
const pusher = require("./pusherService");

const createNotification = async ({
  userId,
  organizationId,
  type,
  resourceId,
  message,
}) => {
  const notification = await Notification.create({
    userId,
    organizationId,
    type,
    resourceId,
    message,
  });

  await pusher.trigger(
    `user-${userId}`,
    "notification-created",
    notification
  );

  return notification;
};

module.exports = createNotification;