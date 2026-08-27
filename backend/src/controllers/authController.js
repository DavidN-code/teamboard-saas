const bcrypt = require('bcrypt');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Invitation = require("../models/Invitation");

const register = async (req, res, next) => {
    try {
      const {
        name,
        email,
        password,
        organizationName,
        invitationToken,
      } = req.body;  

      const normalizedEmail = email?.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // 1. Basic validation
if (!name || !normalizedEmail || !password) {
  return res.status(400).json({
    message: "Name, email, and password are required",
  });
}

if (!emailRegex.test(normalizedEmail)) {
  return res.status(400).json({
    message: "Please enter a valid email address.",
  });
}

if (password.length < 8) {
  return res.status(400).json({
    message: "Password must be at least 8 characters.",
  });
}

if (password.length > 72) {
  return res.status(400).json({
    message: "Password must be 72 characters or fewer.",
  });
}
  
      // 2. Check if user already exists
      const existingUser = await User.findOne({
        email: normalizedEmail,
      });
            if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
  
      // 3. Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

// 4. Check if there is a pending invitation for this email
let invitation = null;
let organization;
let role = "owner";

if (invitationToken) {
  invitation = await Invitation.findOne({
    token: invitationToken,
    email: normalizedEmail,
    status: "pending",
  });

  if (!invitation) {
    return res.status(400).json({
      message: "Invalid or unavailable invitation.",
    });
  }

  if (
    invitation.expiresAt &&
    invitation.expiresAt < new Date()
  ) {
    invitation.status = "expired";
    await invitation.save();

    return res.status(410).json({
      message: "This invitation has expired.",
    });
  }

  organization = await Organization.findById(
    invitation.organizationId
  );

  if (!organization) {
    return res.status(404).json({
      message: "Invited organization not found.",
    });
  }

  role = "member";
} else {
  const pendingInvitation = await Invitation.findOne({
    email: normalizedEmail,
    status: "pending",
  });

  if (pendingInvitation) {
    return res.status(400).json({
      message:
        "A valid invitation token is required to join this organization.",
    });
  }

  if (!organizationName?.trim()) {
    return res.status(400).json({
      message: "Organization name is required",
    });
  }

  organization = await Organization.create({
    name: organizationName.trim(),
  });
}

// 5. Create user
const user = await User.create({
  name: name.trim(),
  email: normalizedEmail,
  password: hashedPassword,
  role,
  organizationId: organization._id,
});

if (invitation) {
  invitation.status = "accepted";
  await invitation.save();
}

// 6. Only set owner if NOT invited user
if (!invitation) {
  organization.ownerId = user._id;
  await organization.save();
}
  
      // 7. Return success (no JWT yet)
      res.status(201).json({
        message: 'User registered successfully',
        userId: user._id,
        organizationId: organization._id
      });
  
    } catch (error) {
      next(error);
    }
  };


  const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email }).select("+password");
        if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const organization = await Organization.findById(
      user.organizationId
    ).select("name");

    // 3. Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        organizationId: user.organizationId,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4. Return token
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: organization?.name || ""
      }
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  register, login
};