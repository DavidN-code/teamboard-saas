const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware"); // JWT auth
const allowRoles = require("../middleware/roleMiddleware");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByBoard,
} = require("../controllers/taskController");

// ✅ GET tasks by board ID (requires auth)
router.get("/boards/:boardId/tasks", protect, getTasksByBoard);

// All routes below require authentication
router.use(protect);

// GET all tasks for the user's organization
router.get("/", getTasks);

// GET a single task by ID
router.get("/:id", getTaskById);

// CREATE a task → only Owner or Admin
router.post("/", allowRoles("Owner", "Admin"), createTask);

// UPDATE a task → only Owner or Admin (adjust if you want only Owner)
router.put("/:id", allowRoles("Owner", "Admin"), updateTask);

// UPDATE a task → only Owner or Admin
router.put("/:id", allowRoles("owner", "admin"), updateTask);

// DELETE a task → only Owner or Admin
router.delete("/:id", allowRoles("Owner", "Admin"), deleteTask);

module.exports = router;