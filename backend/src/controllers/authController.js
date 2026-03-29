const bcrypt = require('bcrypt');
const User = require('../models/User');
const Organization = require('../models/Organization');

const register = async (req, res) => {
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

      // 4. Create organization
      const organization = await Organization.create({
        name: organizationName
      });
  
      // 5. Create user (owner)
     const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role: 'owner',
  organizationId: organization._id
});
  
      // 6. Link owner to organization
      organization.ownerId = user._id;
      await organization.save();
  
      // 7. Return success (no JWT yet)
      res.status(201).json({
        message: 'User registered successfully',
        userId: user._id,
        organizationId: organization._id
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    }
  };

module.exports = {
  register
};