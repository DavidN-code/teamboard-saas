const Invitation = require("../models/Invitation");
const crypto = require("crypto");
const sendInvitationEmail = require("../utils/sendInvitationEmail");
const createAuditLog = require("../services/auditLogService");

exports.createInvitation = async (req, res, next) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const { email } = req.body;
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
  `http://localhost:5173/register?token=${token}`;
  await sendInvitationEmail(email, inviteLink);

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
          message: "Invitation not found or expired",
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
  
  
      invitation.token = newToken;
  
      invitation.expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      );
  
  
      await invitation.save();
  
  
      const inviteLink =
        `http://localhost:5173/register?token=${newToken}`;
  
  
      await sendInvitationEmail(
        invitation.email,
        inviteLink
      );

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