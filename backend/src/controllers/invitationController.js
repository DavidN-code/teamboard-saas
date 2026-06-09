const Invitation = require("../models/Invitation");
const crypto = require("crypto");

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
  console.log("INVITE LINK:", inviteLink);
res.status(201).json({
  message: "Invitation created successfully",
  inviteLink,
});
  } catch (error) {
    next(error);
  }
};

