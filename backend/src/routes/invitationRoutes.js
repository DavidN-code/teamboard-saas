const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  createInvitation,
} = require("../controllers/invitationController");

router.post(
  "/",
  authMiddleware,
  allowRoles("owner", "admin"),
  createInvitation
);

module.exports = router;