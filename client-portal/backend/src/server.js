import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import meRoutes from "./routes/me.js";
import projectRoutes from "./routes/projects.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import { ping, pool } from "./db.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Global middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
  credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));

// Healthcheck
app.get("/health", async (req, res) => {
  try {
    const now = await ping();
    res.json({ status: "ok", now });
  } catch (err) {
    console.error("❌ Ping error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Routes
app.use("/auth", authRoutes);
app.use("/me", meRoutes);
app.use("/projects", projectRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// Well-known fallback
app.get("/.well-known/*", (req, res) => {
  res.type("application/json");
  res.status(404).json({ error: "Not found" });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Check env vars
if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL: JWT_SECRET is not set");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("❌ FATAL: DATABASE_URL is not set");
  process.exit(1);
}

// Start server
const server = app.listen(port, "0.0.0.0", async () => {
  console.log(`✅ API running on http://0.0.0.0:${port}`);
  try {
    const now = await ping();
    console.log(`✅ Database connected, ping: ${now}`);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
});

// Graceful shutdown
async function shutdown(signal) {
  console.log(`🔻 ${signal} received, shutting down...`);
  try {
    await pool.end();
  } catch (err) {
    console.error("❌ Error closing pool:", err.message);
  }
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));