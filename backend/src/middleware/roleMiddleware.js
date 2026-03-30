const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "No user info found" });
      }
  
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: "Access denied: insufficient role" });
      }
  
      next();
    };
  };
  
  module.exports = roleMiddleware;