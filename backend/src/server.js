const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const app = require("./app");

const PORT = process.env.PORT || 5050;

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn(
    "Email configuration is incomplete. Check EMAIL_USER and EMAIL_PASS."
  );
}

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not configured.");
    }

    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 TeamBoard API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();