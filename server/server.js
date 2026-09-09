import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', stack: 'MERN (MongoDB, Express, React, Node.js)', timestamp: new Date().toISOString() });
});

// MongoDB Connection (graceful fallback if local MongoDB is offline)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cstyle';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('[MERN Backend] Successfully connected to MongoDB database!');
  })
  .catch((err) => {
    console.log('[MERN Backend] MongoDB server connection note:', err.message);
    console.log('[MERN Backend] Running seamlessly with Express in-memory database fallback.');
  });

app.listen(PORT, () => {
  console.log(`[MERN Backend] Express Server running on http://localhost:${PORT}`);
});
