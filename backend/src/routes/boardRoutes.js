const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware"); // JWT auth
const allowRoles = require("../middleware/roleMiddleware");

const {
  createBoard,
  getBoardById,
  getBoards,
  updateBoard,
  deleteBoard,
} = require("../controllers/boardController");

// All routes require authentication
router.use(protect);

// GET all boards for the user's organization
router.get("/", getBoards);

// GET single board by ID
router.get("/:id", getBoardById);

// CREATE a new board → only Owner or Admin
router.post("/", allowRoles("Owner", "Admin"), createBoard);

// UPDATE a board → only Owner
router.put("/:id", allowRoles("Owner"), updateBoard);

// DELETE a board → only Owner
router.delete("/:id", allowRoles("Owner"), deleteBoard);
// CREATE a board → only Owner or Admin
router.post("/", allowRoles("owner", "admin"), createBoard);

// UPDATE a board → only Owner or Admin
router.put("/:id", allowRoles("owner", "admin"), updateBoard);

// DELETE a board → only Owner or Admin
router.delete("/:id", allowRoles("owner", "admin"), deleteBoard);

module.exports = router;