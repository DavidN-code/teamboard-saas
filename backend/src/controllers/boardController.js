const Board = require('../models/Board');
const mongoose = require('mongoose');

// GET all boards for the user's organization
exports.getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find({ organizationId: req.user.organizationId });
    res.json(boards);
  } catch (err) {
    next(err);
  }
};

// GET a single board by ID
exports.getBoardById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid board ID' });
    }

    const board = await Board.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.json(board);
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

// CREATE a new board (only Owner can create)
exports.createBoard = async (req, res, next) => {
  try {
    const { name } = req.body;
    const board = await Board.create({
      name,
      organizationId: req.user.organizationId,
      createdBy: req.user._id,
    });
    res.status(201).json(board);
  } catch (err) {
    next(err);
  }
};

// UPDATE a board (only Owner)
exports.updateBoard = async (req, res, next) => {
  try {
    const { name } = req.body;

    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user.organizationId },
      { name },
      { new: true }
    );

    if (!board) return res.status(404).json({ message: 'Board not found' });

    res.json(board);
  } catch (err) {
    next(err);
  }
};

// DELETE a board (only Owner)
exports.deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!board) return res.status(404).json({ message: 'Board not found' });

    res.json({ message: 'Board deleted successfully' });
  } catch (err) {
    next(err);
  }
};