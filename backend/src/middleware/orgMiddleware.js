// backend/src/middleware/orgMiddleware.js

const orgMiddleware = (getResourceOrgId) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "No user info found" });
      }
  
      // getResourceOrgId should return the organizationId of the resource
      const resourceOrgId = getResourceOrgId(req);
      if (!resourceOrgId) {
        return res.status(400).json({ message: "Resource organization not found" });
      }
  
      if (req.user.organizationId.toString() !== resourceOrgId.toString()) {
        return res.status(403).json({ message: "Access denied: different organization" });
      }
  
      next();
    };
  };
  
  module.exports = orgMiddleware;