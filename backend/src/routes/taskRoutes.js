const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator,
  boardIdParamValidator,
} = require("../validators/taskValidator");const validateRequest = require("../middleware/validation");

const {
  createTask,
  getTasks,
  getTasksByBoard,
  getTaskById,
  updateTask,
  deleteTask,
  getMyTasks, // <-- you need to implement this in controller
} = require("../controllers/taskController");

// Apply auth to ALL routes
router.use(protect);

// My Tasks
router.get("/my-tasks", getMyTasks);

// Get all tasks
router.get("/", getTasks);

// Get by board
router.get(
  "/board/:boardId",
  boardIdParamValidator,
  validateRequest,
  getTasksByBoard
);
// Get single task
router.get(
  "/:id",
  taskIdValidator,
  validateRequest,
  getTaskById
);
// Create
router.post(
  "/",
  allowRoles("owner", "admin"),
  createTaskValidator,
  validateRequest,
  createTask
);

// Update
router.put(
  "/:id",
  allowRoles("owner", "admin"),
  updateTaskValidator,
  validateRequest,
  updateTask
);
// Delete
router.delete(
  "/:id",
  allowRoles("owner", "admin"),
  taskIdValidator,
  validateRequest,
  deleteTask
);
module.exports = router;