const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  getActivityFeed,
} = require("../controllers/activityFeedController");

router.use(protect);

router.get("/", getActivityFeed);

module.exports = router;