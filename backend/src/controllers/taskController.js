const Task = require('../models/Task');
const logAction = require("../utils/auditLogger");
const createNotification = require("../utils/notificationService");
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

if (updates.assignedTo === "") {
      updates.assignedTo = null;
    }
    
    const existingTask = await Task.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });
    
    const assigneeChanged =
      updates.assignedTo &&
      updates.assignedTo.toString() !==
        (existingTask.assignedTo?.toString() || "");
    
    let task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        organizationId: req.user.organizationId,
      },
      updates,
      { new: true }
    );
    
    if (!task)
      return res.status(404).json({
        message: "Task not found",
      });
    
    task = await task.populate(
      "assignedTo",
      "name email"
    );
    
    console.log(
      "updates.assignedTo:",
      updates.assignedTo
    );
    console.log(
      "task.assignedTo:",
      task.assignedTo
    );
    console.log(
      "req.user.userId:",
      req.user.userId
    );
    
    const changes = [];
    
    if (
      updates.title &&
      updates.title !== existingTask.title
    ) {
      changes.push(
        `renamed task from "${existingTask.title}" to "${updates.title}"`
      );
    }
    
    if (
      updates.status &&
      updates.status !== existingTask.status
    ) {
      changes.push(
        `moved task from ${existingTask.status} to ${updates.status}`
      );
    }
    
    if (
      updates.priority &&
      updates.priority !== existingTask.priority
    ) {
      changes.push(
        `changed priority from ${existingTask.priority} to ${updates.priority}`
      );
    }
    
    if (
      updates.dueDate &&
      updates.dueDate !==
        existingTask.dueDate?.toISOString()?.split("T")[0]
    ) {
      changes.push(
        `changed due date from ${
          existingTask.dueDate
            ? existingTask.dueDate.toISOString().split("T")[0]
            : "none"
        } to ${updates.dueDate}`
      );
    }
    
    if (
      assigneeChanged &&
      task.assignedTo &&
      task.assignedTo._id.toString() !==
        req.user.userId
    ) {
      const assigningUser =
        await User.findById(req.user.userId);
    
      await createNotification({
        userId: task.assignedTo._id,
        organizationId:
          req.user.organizationId,
        type: "TASK_ASSIGNED",
        resourceId: task._id,
        message: `${assigningUser.name} assigned you task "${task.title}"`,
      });
    }
    
    if (assigneeChanged) {
      await logAction({
        action: "ASSIGN_TASK",
        resourceType: "Task",
        resourceId: task._id,
        userId: req.user.userId,
        organizationId:
          req.user.organizationId,
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
        organizationId:
          req.user.organizationId,
        details: {
          taskTitle: task.title,
          changes,
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

