const Invitation = require("../models/Invitation");

exports.createInvitation = async (req, res, next) => {
  try {
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
    });

    res.status(201).json(invitation);
  } catch (error) {
    next(error);
  }
};