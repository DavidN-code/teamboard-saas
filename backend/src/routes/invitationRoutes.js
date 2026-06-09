const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
    createInvitation,
    getInvitationByToken,
    getPendingInvitations,
    revokeInvitation,
  } = require("../controllers/invitationController");

router.post(
  "/",
  authMiddleware,
  allowRoles("owner", "admin"),
  createInvitation
);

router.get("/token/:token", getInvitationByToken);

router.get(
    "/",
    authMiddleware,
    allowRoles("owner", "admin"),
    getPendingInvitations
  );

  router.delete(
    "/:id",
    authMiddleware,
    allowRoles("owner", "admin"),
    revokeInvitation
  );

module.exports = router;