const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getDashboardMetrics,
} = require("../controllers/metricsController");
console.log("METRICS ROUTES LOADED");
router.get("/", authMiddleware, getDashboardMetrics);

module.exports = router;