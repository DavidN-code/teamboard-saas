const express = require('express');

const app = express();

const authRoutes = require('./routes/authRoutes');


// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = app;


const boardRoutes = require("./routes/boardRoutes");
app.use("/api/boards", boardRoutes);