const express = require("express");
const router = express.Router();

const {
  createComment,
  getCommentsByTask,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const {
  createCommentValidator,
  updateCommentValidator,
} = require("../validators/commentValidator");

const validateRequest = require("../middleware/validation");

const protect = require("../middleware/authMiddleware");

router.use(protect);

router.post(
  "/",
  createCommentValidator,
  validateRequest,
  createComment
);

router.put(
  "/:id",
  updateCommentValidator,
  validateRequest,
  updateComment
);
router.get("/task/:taskId", getCommentsByTask);
router.delete("/:id", deleteComment);

module.exports = router;