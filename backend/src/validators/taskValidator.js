const { body } = require("express-validator");

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

  body("dueDate")
    .optional({ checkFalsy: true })
    .isISO8601({ strict: true })
    .withMessage("Due date must be a valid date")
    .custom((value) => {
      const year = Number(value.slice(0, 4));

      if (year < 1900 || year > 2100) {
        throw new Error("Due date year must be between 1900 and 2100");
      }

      return true;
    }),
];

module.exports = {
  createTaskValidator,
};