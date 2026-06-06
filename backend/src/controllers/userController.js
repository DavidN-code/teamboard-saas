const User = require("../models/User");

// GET all users in current organization
exports.getUsers = async (req, res, next) => {
  console.log("USER ROUTE HIT");
console.log("REQ USER:", req.user);
  try {
    const users = await User.find({
      organizationId: req.user.organizationId,
    }).select("-password");

    res.json(users);
  } catch (error) {
    next(error);
  }
};

// UPDATE user role
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    const validRoles = ["owner", "admin", "member"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const user = await User.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "owner" && role !== "owner") {
      const ownerCount = await User.countDocuments({
        organizationId: req.user.organizationId,
        role: "owner",
      });
    
      if (ownerCount <= 1) {
        return res.status(400).json({
          message: "Cannot change the role of the last owner",
        });
      }
    }

    user.role = role;

    await user.save();

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// DELETE user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    if (user.role === "owner") {
      const ownerCount = await User.countDocuments({
        organizationId: req.user.organizationId,
        role: "owner",
      });
    
      if (ownerCount <= 1) {
        return res.status(400).json({
          message: "Cannot delete the last owner",
        });
      }
    }

    await user.deleteOne();

    res.json({
      message: "User removed successfully",
    });
  } catch (error) {
    next(error);
  }
};