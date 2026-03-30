const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const orgMiddleware = require("../middleware/orgMiddleware");
const Board = require("../models/Board");

// Create a new board (only owner can do this)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("owner"),
  async (req, res) => {
    try {
      const { name } = req.body;
      const board = await Board.create({
        name,
        organizationId: req.user.organizationId,
        createdBy: req.user.userId,
      });
      res.status(201).json({ message: "Board created", board });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get a single board (any user in the same org can access)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // 🔥 Org check directly here (simpler + safer)
    if (board.organizationId.toString() !== req.user.organizationId) {
      return res.status(403).json({ message: "Access denied: different organization" });
    }

    res.json({ board });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;