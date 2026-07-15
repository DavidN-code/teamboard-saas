const express = require('express');
const cors = require('cors');  // <- import cors
const app = express();

const authRoutes = require('./routes/authRoutes');
const boardRoutes = require("./routes/boardRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const auditLogRoutes = require("./routes/auditLogRoutes");
const userRoutes = require("./routes/userRoutes");
const metricsRoutes = require("./routes/metricsRoutes");
const invitationRoutes = require("./routes/invitationRoutes");
const commentRoutes = require("./routes/commentRoutes");
const activityFeedRoutes = require("./routes/activityFeedRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const helmet = require("helmet");
const authLimiter = require("./middleware/authLimiter");
const apiLimiter = require("./middleware/apiLimiter");

// Middleware
app.use(helmet());

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true // optional if you want cookies later
}));

app.use(express.json());

app.use("/api", apiLimiter);

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/activity-feed", activityFeedRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/metrics/dashboard", metricsRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/notifications", notificationRoutes);


// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});


app.use(errorMiddleware);


module.exports = app;


