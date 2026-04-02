// backend/src/middleware/roleMiddleware.js

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No user info found" });
    }

    console.log("User role:", req.user.role);
    console.log("Allowed roles:", roles);

    // Check if user's role is allowed
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }

    next();
  };
};

module.exports = allowRoles; // ✅ default export