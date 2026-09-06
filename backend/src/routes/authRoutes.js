const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authMiddleware = require("../middleware/authMiddleware");
const { loginValidator } = require("../validators/authValidator");
const validateRequest = require("../middleware/validation");


router.post('/register', register);
router.post(
  "/login",
  loginValidator,
  validateRequest,
  login
);

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route!",
    user: req.user
  });
});

module.exports = router;
