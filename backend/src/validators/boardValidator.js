const { body, param } = require("express-validator");

const boardNameValidator = body("name")
  .trim()
  .notEmpty()
  .withMessage("Board name is required")
  .isLength({ max: 100 })
  .withMessage("Board name cannot exceed 100 characters");

const createBoardValidator = [
  boardNameValidator,
];

const updateBoardValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid board ID"),

  boardNameValidator,
];

const boardIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid board ID"),
];

module.exports = {
  createBoardValidator,
  updateBoardValidator,
  boardIdValidator,
};
