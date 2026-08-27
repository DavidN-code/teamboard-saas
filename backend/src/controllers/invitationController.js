const Invitation = require("../models/Invitation");
const User = require("../models/User");
const crypto = require("crypto");
const sendInvitationEmail = require("../utils/sendInvitationEmail");
const createAuditLog = require("../services/auditLogService");

exports.createInvitation = async (req, res, next) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({
        message: "Email address is required.",
      });
    }
    const existingUser = await User.findOne({
      email,
    });
    
    if (existingUser) {
      return res.status(400).json({
        message: "A TeamBoard account already exists with this email address.",
      });
    }
    const existingInvitation = await Invitation.findOne({
        email,
        organizationId: req.user.organizationId,
        status: "pending",
      });
      
      if (existingInvitation) {
        return res.status(400).json({
          message: "Pending invitation already exists",
        });
      }

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      
      const invitation = await Invitation.create({
        email,
        organizationId: req.user.organizationId,
        invitedBy: req.user.userId,
        token,
        expiresAt: expirationDate,
      });

    const inviteLink =
    `${process.env.FRONTEND_URL}/register?token=${token}`;
  try {
  await sendInvitationEmail(email, inviteLink);
} catch (err) {
  await invitation.deleteOne();
  throw err;
}

  await createAuditLog({
    action: "CREATE_INVITATION",
    resourceType: "Invitation",
    resourceId: invitation._id,
    userId: req.user.userId,
    organizationId: req.user.organizationId,
    details: {
  inviteeEmail: invitation.email,
},
  });
  
res.status(201).json({
  message: "Invitation created successfully",
  inviteLink,
});
  } catch (error) {
    next(error);
  }
};

exports.getInvitationByToken = async (req, res, next) => {
    try {
      const invitation = await Invitation.findOne({
        token: req.params.token,
        status: "pending",
      });
  
      if (!invitation) {
        return res.status(404).json({
          message: "This invitation is no longer available. It may have already been accepted or expired.",

        });
      }

      if (invitation.expiresAt < new Date()) {
        invitation.status = "expired";
        await invitation.save();
      
        return res.status(410).json({
          message: "This invitation has expired.",
        });
      }
  
      res.json(invitation);
    } catch (error) {
      next(error);
    }
  };

  exports.getPendingInvitations = async (req, res, next) => {
    try {    
      const invitations = await Invitation.find({
        organizationId: req.user.organizationId,
        status: "pending",
      })
        .populate("invitedBy", "name email")
        .sort({ createdAt: -1 });
  
      res.json(invitations);
    } catch (error) {
      next(error);
    }
  };

  exports.revokeInvitation = async (req, res, next) => {
    try {
      const invitation = await Invitation.findOne({
        _id: req.params.id,
        organizationId: req.user.organizationId,
        status: "pending",
      });
  
      if (!invitation) {
        return res.status(404).json({
          message: "Invitation not found",
        });
      }
  
      await invitation.deleteOne();
  
      res.json({
        message: "Invitation revoked successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  exports.resendInvitation = async (req, res, next) => {
    try {
  
      const invitation = await Invitation.findOne({
        _id: req.params.id,
        organizationId: req.user.organizationId,
        status: "pending",
      });
  
  
      if (!invitation) {
        return res.status(404).json({
          message: "Invitation not found",
        });
      }
  
  
      const newToken = crypto.randomBytes(32).toString("hex");

const newExpiresAt = new Date(
  Date.now() + 7 * 24 * 60 * 60 * 1000
);

const inviteLink =
  `${process.env.FRONTEND_URL}/register?token=${newToken}`;

await sendInvitationEmail(
  invitation.email,
  inviteLink
);

invitation.token = newToken;
invitation.expiresAt = newExpiresAt;

await invitation.save();

      await createAuditLog({
        action: "RESEND_INVITATION",
        resourceType: "Invitation",
        resourceId: invitation._id,
        userId: req.user.userId,
        organizationId: req.user.organizationId,
        details: {
  inviteeEmail: invitation.email,
}
      });
  
      res.json({
        message: "Invitation resent successfully",
      });
  
  
    } catch(error) {
      next(error);
    }
  };