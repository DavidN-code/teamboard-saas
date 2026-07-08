const { body } = require("express-validator");

const createCommentValidator = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("Comment cannot exceed 1000 characters"),

  body("taskId")
    .notEmpty()
    .withMessage("Task ID is required"),
];

const updateCommentValidator = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("Comment cannot exceed 1000 characters"),
];

module.exports = {
  createCommentValidator,
  updateCommentValidator,
};