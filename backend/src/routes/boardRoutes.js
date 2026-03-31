const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const orgMiddleware = require("../middleware/orgMiddleware");
const Board = require("../models/Board");
const mongoose = require("mongoose");

// Create a new board (only owner can do this)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("owner"),
  async (req, res, next) => {
    try {
      const { name } = req.body;
      const board = await Board.create({
        name,
        organizationId: req.user.organizationId,
        createdBy: req.user.userId,
      });
      res.status(201).json({ message: "Board created", board });
    } catch (error) {
      next(error);
    }
  }
);

//get a list
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const boards = await Board.find({
      organizationId: req.user.organizationId
    });

    res.json({ boards });

  } catch (error) {
    next(error);
  }
});


// Get a single board (any user in the same org can access)
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

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
    next(error);
  }
});


router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }
    const { name } = req.body;

    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Org check
    if (board.organizationId.toString() !== req.user.organizationId) {
      return res.status(403).json({ message: "Access denied: different organization" });
    }

    // Role check (only owner can update)
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owners can update boards" });
    }

    board.name = name || board.name;
    await board.save();

    res.json({ message: "Board updated", board });

  } catch (error) {
    next(error);
  }
});


router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Org check
    if (board.organizationId.toString() !== req.user.organizationId) {
      return res.status(403).json({ message: "Access denied: different organization" });
    }

    // Role check
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owners can delete boards" });
    }

    await board.deleteOne();

    res.json({ message: "Board deleted" });

  } catch (error) {
    next(error);
  }
});



module.exports = router;