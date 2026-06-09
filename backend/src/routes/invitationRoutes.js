const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
    createInvitation,
    getInvitationByToken,
  } = require("../controllers/invitationController");

router.post(
  "/",
  authMiddleware,
  allowRoles("owner", "admin"),
  createInvitation
);

router.get("/token/:token", getInvitationByToken);

module.exports = router;