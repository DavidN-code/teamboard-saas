const { body, param } = require("express-validator");

const validStatuses = ["todo", "in-progress", "done"];
const validPriorities = ["low", "medium", "high"];

const dueDateValidator = (field) =>
  body(field)
    .optional({ checkFalsy: true })
    .isISO8601({ strict: true })
    .withMessage("Due date must be a valid date")
    .custom((value) => {
      const year = Number(value.slice(0, 4));

      if (year < 1900 || year > 2100) {
        throw new Error(
          "Due date year must be between 1900 and 2100"
        );
      }

      return true;
    });

const createTaskValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ max: 100 })
    .withMessage("Task title cannot exceed 100 characters"),

  body("description")
    .optional()
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters"),

  body("status")
    .optional()
    .isIn(validStatuses)
    .withMessage("Invalid task status"),

  body("priority")
    .optional()
    .isIn(validPriorities)
    .withMessage("Invalid task priority"),

  dueDateValidator("dueDate"),

  body("board")
    .notEmpty()
    .withMessage("Board is required")
    .isMongoId()
    .withMessage("Invalid board ID"),

  body("assignedTo")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("Invalid assignee ID"),
];

const updateTaskValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid task ID"),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Task title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Task title cannot exceed 100 characters"),

  body("description")
    .optional()
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters"),

  body("status")
    .optional()
    .isIn(validStatuses)
    .withMessage("Invalid task status"),

  body("priority")
    .optional()
    .isIn(validPriorities)
    .withMessage("Invalid task priority"),

  dueDateValidator("dueDate"),

  body("assignedTo")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("Invalid assignee ID"),
];

const taskIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid task ID"),
];

const boardIdParamValidator = [
  param("boardId")
    .isMongoId()
    .withMessage("Invalid board ID"),
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator,
  boardIdParamValidator,
};