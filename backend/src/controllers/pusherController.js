const Board = require("../models/Board");
const Task = require("../models/Task");
const pusher = require("../services/pusherService");

exports.authorizeChannel = async (req, res, next) => {
  try {
    const { socket_id: socketId, channel_name: channelName } = req.body;

    if (!socketId || !channelName) {
      return res.status(400).json({
        message: "socket_id and channel_name are required",
      });
    }

    let authorized = false;

    // Organization-wide events
    const organizationMatch = channelName.match(
      /^private-organization-(.+)$/
    );

    if (organizationMatch) {
      const organizationId = organizationMatch[1];

      authorized =
        organizationId === req.user.organizationId;
    }

    // Board-specific events
    const boardMatch = channelName.match(/^private-board-(.+)$/);

    if (boardMatch) {
      const boardId = boardMatch[1];

      const board = await Board.findOne({
        _id: boardId,
        organizationId: req.user.organizationId,
      }).select("_id");

      authorized = Boolean(board);
    }

    // Task-specific events
    const taskMatch = channelName.match(/^private-task-(.+)$/);

    if (taskMatch) {
      const taskId = taskMatch[1];

      const task = await Task.findOne({
        _id: taskId,
        organizationId: req.user.organizationId,
      }).select("_id");

      authorized = Boolean(task);
    }

    // Personal notification channel
    const userMatch = channelName.match(/^private-user-(.+)$/);

    if (userMatch) {
      const userId = userMatch[1];

      authorized = userId === req.user.userId;
    }

    if (!authorized) {
      return res.status(403).json({
        message: "Not authorized for this channel",
      });
    }

    const authResponse = pusher.authorizeChannel(
      socketId,
      channelName
    );

    return res.send(authResponse);
  } catch (error) {
    next(error);
  }
};