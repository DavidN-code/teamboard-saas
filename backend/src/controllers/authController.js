const bcrypt = require('bcrypt');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Invitation = require("../models/Invitation");

const register = async (req, res, next) => {
    try {
      const { name, email, password, organizationName } = req.body;
  
      // 1. Basic validation
      if (!name || !email || !password || !organizationName) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // 2. Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
  
      // 3. Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

// 4. Check if there is a pending invitation for this email
const invitation = await Invitation.findOne({
  email,
  status: "pending",
});

let organization;
let role = "owner";

// CASE 1: invited user exists
if (invitation) {
  organization = await Organization.findById(invitation.organizationId);
  role = "member";

  invitation.status = "accepted";
  await invitation.save();
} 
// CASE 2: normal signup
else {
  organization = await Organization.create({
    name: organizationName,
  });
}

// 5. Create user
const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role,
  organizationId: organization._id,
});

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

    console.log("LOGIN SECRET:", process.env.JWT_SECRET);


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
        organizationId: user.organizationId
      }
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  register, login
};