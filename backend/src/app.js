const express = require('express');

const app = express();

const authRoutes = require('./routes/authRoutes');

const boardRoutes = require("./routes/boardRoutes");


// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/boards", boardRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});


const errorMiddleware = require("./middleware/errorMiddleware");

app.use(errorMiddleware);


module.exports = app;


