const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
console.log("🔥 SERVER STARTED");
console.log("EMAIL_USER (server):", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists (server):", !!process.env.EMAIL_PASS);
console.log("CWD:", process.cwd());
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5050;

const startServer = async () => {
  try {
    // Connect to MongoDB 
    console.log('Connecting to MongoDB...');

    console.log('MONGO_URI:', process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

startServer();