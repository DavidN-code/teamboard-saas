const Invitation = require("../models/Invitation");
const crypto = require("crypto");
const sendInvitationEmail = require("../utils/sendInvitationEmail");

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

    const invitation = await Invitation.create({
      email,
      organizationId: req.user.organizationId,
      invitedBy: req.user.userId,
      token,
    });

    const inviteLink =
  `http://localhost:5173/register?token=${token}`;
  await sendInvitationEmail(email, inviteLink);
  
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