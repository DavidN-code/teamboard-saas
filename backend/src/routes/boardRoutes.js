// backend/src/routes/boardRoutes.js

const express = require("express");
const router = express.Router();

const { getBoards, createBoard, getBoardById, updateBoard, deleteBoard } = require("../controllers/boardController");
const protect = require("../middleware/authMiddleware"); // JWT auth
const allowRoles = require("../middleware/roleMiddleware"); // ✅ matches default export

// All routes require authentication
router.use(protect);

// GET all boards for the user's organization
router.get("/", getBoards);

// GET a single board by ID
router.get("/:id", getBoardById);

// CREATE a new board → only Owner or Admin
router.post("/", allowRoles("owner", "admin"), createBoard);

// UPDATE a board → only Owner
router.put("/:id", allowRoles("owner"), updateBoard);

// DELETE a board → only Owner
router.delete("/:id", allowRoles("owner"), deleteBoard);

module.exports = router;