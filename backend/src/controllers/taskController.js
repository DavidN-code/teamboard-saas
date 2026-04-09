const Task = require('../models/Task');

// CREATE a new Task
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      assignedTo,
      organizationId: req.user.organizationId,
      createdBy: req.user._id,
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// GET all tasks for the user's organization
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ organizationId: req.user.organizationId });
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
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.getTasksByBoard = async (req, res, next) => {
  try {
    const { boardId } = req.params;

    const tasks = await Task.find({
      boardId,
      organizationId: req.user.organizationId
    });

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// UPDATE a task
exports.updateTask = async (req, res, next) => {
  try {
    const updates = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user.organizationId },
      updates,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
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
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};