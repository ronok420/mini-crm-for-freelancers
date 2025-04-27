 
// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import clientRoutes from './routes/clients';
import projectRoutes from './routes/projects';
import interactionLogRoutes from './routes/interactionLogs';
import reminderRoutes from './routes/reminders';
import dashboardRoutes from './routes/dashboard';

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/logs', interactionLogRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Backend is running 🔥' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
