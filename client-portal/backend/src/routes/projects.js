import { Router } from "express";
import { pool } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Отримати всі проекти користувача
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, title, status, deadline, created_at, updated_at FROM projects WHERE user_id=$1 ORDER BY updated_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Get projects error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Створити новий проект
router.post("/", authMiddleware, async (req, res) => {
  const { title, status = "active", deadline = null } = req.body;
  if (!title) return res.status(400).json({ error: "Title required" });

  try {
    const { rows } = await pool.query(
      `INSERT INTO projects(user_id, title, status, deadline)
       VALUES($1,$2,$3,$4)
       RETURNING id, title, status, deadline, created_at, updated_at`,
      [req.user.id, title, status, deadline]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("❌ Create project error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Оновити проект
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, status, deadline } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE projects
       SET title=COALESCE(NULLIF($1,''),title),
           status=COALESCE(NULLIF($2,''),status),
           deadline=$3,
           updated_at=NOW()
       WHERE id=$4 AND user_id=$5
       RETURNING id, title, status, deadline, created_at, updated_at`,
      [title ?? null, status ?? null, deadline ?? null, id, req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Update project error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Видалити проект
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM projects WHERE id=$1 AND user_id=$2",
      [id, req.user.id]
    );

    if (rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  } catch (err) {
    console.error("❌ Delete project error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;