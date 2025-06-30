import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Models and routes
import Problem from './models/Problem.js';
import problemRoutes from './routes/problemRoutes.js';
import submitRoute from './routes/submitRoute.js';
import submissionRoutes from './routes/submissionRoutes.js';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('VibeCode backend is working!');
});

// API routes
app.use('/api/problems', problemRoutes);
app.use('/api/submit', submitRoute);
app.use('/api/submissions', submissionRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
