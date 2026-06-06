const User = require("../models/User");
const Board = require("../models/Board");
const Task = require("../models/Task");

exports.getDashboardMetrics = async (req, res, next) => {
    console.log("🔥 METRICS CONTROLLER HIT");
  try {

    const organizationId = req.user.organizationId;

    // Count users
    const users = await User.countDocuments({ organizationId });

    // Count boards
    const boards = await Board.countDocuments({ organizationId });

    // Get all tasks (we need status breakdown)
    const tasks = await Task.find({ organizationId });

    const totalTasks = tasks.length;

    const todo = tasks.filter(t => t.status === "todo").length;
    const inProgress = tasks.filter(t => t.status === "in-progress").length;
    const done = tasks.filter(t => t.status === "done").length;

    res.json({
      users,
      boards,
      tasks: totalTasks,
      todo,
      inProgress,
      done,
    });
  } catch (error) {
    next(error);
  }
};