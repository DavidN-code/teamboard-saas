const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  authorizeChannel,
} = require("../controllers/pusherController");

router.post("/auth", authMiddleware, authorizeChannel);

module.exports = router;