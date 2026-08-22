const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token, authorization denied",
      });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Load the user's CURRENT authorization data
    const user = await User.findById(decoded.userId).select(
      "_id organizationId role"
    );

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    // 5. Attach current user info to request
    req.user = {
      userId: user._id.toString(),
      organizationId: user.organizationId.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token is not valid",
    });
  }
};

module.exports = authMiddleware;