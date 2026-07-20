const Task = require('../models/Task');
const createAuditLog = require("../services/auditLogService");
const createNotification = require("../services/notificationService");
const User = require("../models/User");

// CREATE a new Task
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo, board } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      board,
      organizationId: req.user.organizationId,
      createdBy: req.user.userId,
    });

    // ✅ MOVE HERE
    await createAuditLog({
      action: "CREATE_TASK",
      resourceType: "Task",
      resourceId: task._id,
      boardId: task.board,
      userId: req.user.userId,
      organizationId: req.user.organizationId,
      details: {
        taskTitle: task.title,
      },
    });

        // Notify assignee when a task is created and assigned
        if (
          assignedTo &&
          assignedTo.toString() !== req.user.userId
        ) {
          const assigningUser = await User.findById(req.user.userId);
    
          await createNotification({
            userId: assignedTo,
            organizationId: req.user.organizationId,
            type: "TASK_ASSIGNED",
            resourceId: task._id,
            message: `${assigningUser.name} assigned you task "${task.title}"`,
          });
        }

    const populatedTask = await Task.findById(task._id)
  .populate("assignedTo", "name email")
  .populate("createdBy", "name email");

  res.status(201).json(populatedTask);

  } catch (err) {
    next(err);
  }
};



// GET all tasks for the user's organization
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      organizationId: req.user.organizationId,
    })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");
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
    })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

    res.json(tasks);

  } catch (err) {
    next(err);
  }
};

// GET tasks assigned to the current user
exports.getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user.userId,
      organizationId: req.user.organizationId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("board", "name");

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
    })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");
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

    console.log("UPDATES RECEIVED:", updates);

    // normalize empty assignment
    if (updates.assignedTo === "") {
      updates.assignedTo = null;
    }

    // fetch existing task FIRST
    const existingTask = await Task.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const assigneeChanged =
      updates.assignedTo &&
      updates.assignedTo.toString() !==
        (existingTask.assignedTo?.toString() || "");

    // update task
    let task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        organizationId: req.user.organizationId,
      },
      updates,
      { new: true }
    ).populate("assignedTo", "name email");

    console.log("updates.assignedTo:", updates.assignedTo);
    console.log("task.assignedTo:", task.assignedTo);
    console.log("req.user.userId:", req.user.userId);

    // -------------------------
    // BUILD CHANGE LIST
    // -------------------------
    const changes = [];

    if (updates.title && updates.title !== existingTask.title) {
      changes.push(
        `renamed task from "${existingTask.title}" to "${updates.title}"`
      );
    }

    if (updates.status && updates.status !== existingTask.status) {
      changes.push(
        `moved task from ${existingTask.status} to ${updates.status}`
      );
    }

    if (updates.priority && updates.priority !== existingTask.priority) {
      changes.push(
        `changed priority from ${existingTask.priority} to ${updates.priority}`
      );
    }

    // safer dueDate comparison (fixes silent failures)
    if (updates.dueDate !== undefined) {
      const oldDate = existingTask.dueDate
        ? new Date(existingTask.dueDate).toISOString().split("T")[0]
        : null;

      if (updates.dueDate !== oldDate) {
        changes.push(
          `changed due date from ${oldDate || "none"} to ${updates.dueDate}`
        );
      }
    }

    // -------------------------
    // NOTIFICATION
    // -------------------------
    if (
      assigneeChanged &&
      task.assignedTo &&
      task.assignedTo._id.toString() !== req.user.userId
    ) {
      const assigningUser = await User.findById(req.user.userId);

      await createNotification({
        userId: task.assignedTo._id,
        organizationId: req.user.organizationId,
        type: "TASK_ASSIGNED",
        resourceId: task._id,
        message: `${assigningUser.name} assigned you task "${task.title}"`,
      });
    }

    
   // -------------------------
// AUDIT LOGGING
// -------------------------

if (assigneeChanged) {
  await createAuditLog({
    action: "ASSIGN_TASK",
    resourceType: "Task",
    resourceId: task._id,
    boardId: task.board,
    userId: req.user.userId,
    organizationId: req.user.organizationId,
    details: {
      taskTitle: task.title,
      assignedTo: task.assignedTo?.name,
    },
  });
}


// Log other changes separately
if (changes.length > 0) {
  await createAuditLog({
    action: "UPDATE_TASK",
    resourceType: "Task",
    resourceId: task._id,
    boardId: task.board,
    userId: req.user.userId,
    organizationId: req.user.organizationId,
    details: {
      taskTitle: task.title,
      changes,
    },
  });
}

    return res.json(task);
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
    await createAuditLog({
      action: "DELETE_TASK",
      resourceType: "Task",
      resourceId: task._id,
      boardId: task.board,
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

