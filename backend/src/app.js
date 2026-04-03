const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes');
const boardRoutes = require("./routes/boardRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const auditLogRoutes = require("./routes/auditLogRoutes");

app.use("/api/audit-logs", auditLogRoutes);

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});


app.use(errorMiddleware);


module.exports = app;


