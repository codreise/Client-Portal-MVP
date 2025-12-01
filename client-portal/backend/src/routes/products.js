import express from "express";
import { pool } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Отримати всі товари
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Get products error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Додати товар (тільки адмін)
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, price, stock } = req.body;

  if (!title || !price || stock == null) {
    return res.status(400).json({ error: "Title, price and stock are required" });
  }

  try {
    // Перевірка ролі користувача
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: only admins can add products" });
    }

    const result = await pool.query(
      "INSERT INTO products (title, description, price, stock) VALUES ($1,$2,$3,$4) RETURNING *",
      [title, description, price, stock]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Add product error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;