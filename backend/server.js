const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const projectRoutes = require('./routes/projectRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Pass DB connection status to request context for seamless fallback support
app.use((req, res, next) => {
  req.isDbConnected = mongoose.connection.readyState === 1;
  next();
});

// Routes
app.use('/api/projects', projectRoutes);

// Health & Status Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'FlowState AI Productivity Platform',
    database: mongoose.connection.readyState === 1 ? 'connected (MongoDB)' : 'in-memory active',
    aiEngine: process.env.FEATHERLESS_API_KEY && process.env.FEATHERLESS_API_KEY !== 'your_featherless_api_key_here' ? 'Featherless.ai active' : 'Heuristic Inference active'
  });
});

// Centralized Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[FlowState Server] Listening on port ${PORT}`);
});
