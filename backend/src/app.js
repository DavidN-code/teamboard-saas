const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = app;