const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
    createInvitation,
    getInvitationByToken,
    getPendingInvitations,
    revokeInvitation,
    resendInvitation
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

  router.put(
    "/:id/resend",
    authMiddleware,
    allowRoles("owner", "admin"),
    resendInvitation
  );

module.exports = router;