const { body, param } = require("express-validator");

const createCommentValidator = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("Comment cannot exceed 1000 characters"),

  body("taskId")
    .notEmpty()
    .withMessage("Task ID is required")
    .isMongoId()
    .withMessage("Invalid task ID"),
];

const updateCommentValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid comment ID"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("Comment cannot exceed 1000 characters"),
];

const commentIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid comment ID"),
];

const taskIdParamValidator = [
  param("taskId")
    .isMongoId()
    .withMessage("Invalid task ID"),
];

module.exports = {
  createCommentValidator,
  updateCommentValidator,
  commentIdValidator,
  taskIdParamValidator,
};