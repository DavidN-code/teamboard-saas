const express = require('express');
const cors = require('cors');  // <- import cors
const app = express();

const authRoutes = require('./routes/authRoutes');
const boardRoutes = require("./routes/boardRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const auditLogRoutes = require("./routes/auditLogRoutes");


// Middleware
app.use(express.json());

app.post("/test-json", (req, res) => {
  console.log("Body received:", req.body);
  res.json({ ok: true });
});

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true // optional if you want cookies later
}));

app.use("/api/audit-logs", auditLogRoutes);


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


