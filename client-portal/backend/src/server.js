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

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Healthcheck
app.get('/health', async (req, res) => {
  try {
    const now = await ping();
    res.json({ status: 'ok', now });
  } catch (err) {
    console.error('❌ Ping error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Routes
app.use('/auth', authRoutes);
app.use('/me', meRoutes);
app.use('/projects', projectRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Check env vars
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET is not set');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error('❌ FATAL: DATABASE_URL is not set');
  process.exit(1);
}

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ API running on http://0.0.0.0:${port}`);
  console.log(`✅ Database connected: ${process.env.DATABASE_URL.split('@')[1] || 'configured'}`);
});

// Well-known fallback
app.get('/.well-known/*', (req, res) => {
  res.type('application/json');
  res.status(404).json({ error: 'Not found' });
});