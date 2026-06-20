const Task = require('../models/Task');
const logAction = require("../utils/auditLogger");
const createNotification = require("../utils/notificationService");
const User = require("../models/User");

// CREATE a new Task
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, assignedTo, board } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      assignedTo,
      board,
      organizationId: req.user.organizationId,
      createdBy: req.user.userId,
    });

    // ✅ MOVE HERE
    await logAction({
      action: "CREATE_TASK",
      resourceType: "Task",
      resourceId: task._id,
      userId: req.user.userId,
      organizationId: req.user.organizationId,
      details: {
        taskTitle: task.title,
      },
    });

    res.status(201).json(task);

  } catch (err) {
    next(err);
  }
};



// GET all tasks for the user's organization
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      organizationId: req.user.organizationId,
    }).populate("assignedTo", "name email");
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.getTasksByBoard = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      board: req.params.boardId,
      organizationId: req.user.organizationId,
    }).populate("assignedTo", "name email");

    res.json(tasks);

  } catch (err) {
    next(err);
  }
};

// GET a single task by ID
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    }).populate("assignedTo", "name email");
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// UPDATE a task
exports.updateTask = async (req, res, next) => {
  try {
    const updates = req.body;

    let task = await Task.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user.organizationId },
      updates,
      { new: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });
    task = await task.populate("assignedTo", "name email");

    console.log("updates.assignedTo:", updates.assignedTo);
console.log("task.assignedTo:", task.assignedTo);
console.log("req.user.userId:", req.user.userId);

if (
  updates.assignedTo &&
  task.assignedTo &&
  task.assignedTo._id.toString() !== req.user.userId
) {

  const assigningUser = await User.findById(req.user.userId);

  const notification = await createNotification({
    userId: task.assignedTo._id,
    organizationId: req.user.organizationId,
    type: "TASK_ASSIGNED",
    resourceId: task._id,
    message: `${assigningUser.name} assigned you task "${task.title}"`,
  });

}

    // ✅ MOVE HERE
    if (updates.assignedTo) {
      await logAction({
        action: "ASSIGN_TASK",
        resourceType: "Task",
        resourceId: task._id,
        userId: req.user.userId,
        organizationId: req.user.organizationId,
        details: {
          taskTitle: task.title,
          assignedTo: task.assignedTo.name,
        },
      });
    } else {
      await logAction({
        action: "UPDATE_TASK",
        resourceType: "Task",
        resourceId: task._id,
        userId: req.user.userId,
        organizationId: req.user.organizationId,
        details: {
          taskTitle: task.title,
        },
      });
    }

    res.json(task);

  } catch (err) {
    next(err);
  }
};



// DELETE a task
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // ✅ MOVE HERE
    await logAction({
      action: "DELETE_TASK",
      resourceType: "Task",
      resourceId: task._id,
      userId: req.user.userId,
      organizationId: req.user.organizationId,
      details: {
        taskTitle: task.title,
      },
    });

    res.json({ message: 'Task deleted successfully' });

  } catch (err) {
    next(err);
  }
};

