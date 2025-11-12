// backend/src/server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import meRoutes from './routes/me.js';
import projectRoutes from './routes/projects.js';
import { ping } from './db.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', async (req, res) => {
  try {
    const now = await ping();
    res.json({ status: 'ok', now });
  } catch {
    res.status(500).json({ status: 'error' });
  }
});

app.use('/auth', authRoutes);
app.use('/me', meRoutes);
app.use('/projects', projectRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`API running on http://0.0.0.0:${port}`);
});

app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});