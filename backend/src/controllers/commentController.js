const Comment = require("../models/Comment");
const logAction = require("../utils/auditLogger");
const Task = require("../models/Task");
const createNotification = require("../utils/notificationService");
const User = require("../models/User");

// CREATE COMMENT
exports.createComment = async (req, res, next) => {
  try {
    const { content, taskId } = req.body;

    const comment = await Comment.create({
      content,
      taskId,
      organizationId: req.user.organizationId,
      createdBy: req.user.userId,
    });

    await logAction({
      action: "CREATE_COMMENT",
      resourceType: "Task",
      resourceId: comment.taskId,
      userId: req.user.userId,
      organizationId: req.user.organizationId,
      details: {
        commentPreview: comment.content.substring(0, 50),
      },
    });

    const task = await Task.findById(comment.taskId);

    if (
      task &&
      task.createdBy.toString() !== req.user.userId
    ) {
      const user = await User.findById(req.user.userId);

  await createNotification({
    userId: task.createdBy,
    organizationId: req.user.organizationId,
    type: "TASK_COMMENT",
    message: `${user.name} commented on your task "${task.title}"`,
  });
}

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

// GET COMMENTS FOR A TASK
exports.getCommentsByTask = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      taskId: req.params.taskId,
      organizationId: req.user.organizationId,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// UPDATE COMMENT
exports.updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.content = req.body.content;
    await comment.save();

    await logAction({
      action: "UPDATE_COMMENT",
      resourceType: "Task",
      resourceId: comment.taskId,
      userId: req.user.userId,
      organizationId: req.user.organizationId,
      details: {
        commentPreview: comment.content.substring(0, 50),
      },
    });

    res.json(comment);
  } catch (err) {
    next(err);
  }
};

// DELETE COMMENT
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isOwner =
      comment.createdBy.toString() === req.user.userId;

    const isAdminOrOwner =
      req.user.role === "admin" || req.user.role === "owner";

    if (!isOwner && !isAdminOrOwner) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();

    await logAction({
      action: "DELETE_COMMENT",
      resourceType: "Task",
      resourceId: comment.taskId,
      userId: req.user.userId,
      organizationId: req.user.organizationId,
      details: {
        commentPreview: comment.content.substring(0, 50),
      },
    });

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    next(err);
  }
};