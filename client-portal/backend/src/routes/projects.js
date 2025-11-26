import { Router } from 'express';
import pool from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', authRequired, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, title, status, deadline, created_at, updated_at FROM projects WHERE user_id=$1 ORDER BY updated_at DESC',
    [req.user.id]
  );
  res.json(rows);
});

router.post('/', authRequired, async (req, res) => {
  const { title, status = 'active', deadline = null } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const { rows } = await pool.query(
    `INSERT INTO projects(user_id, title, status, deadline)
     VALUES($1,$2,$3,$4)
     RETURNING id, title, status, deadline, created_at, updated_at`,
    [req.user.id, title, status, deadline]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', authRequired, async (req, res) => {
  const { id } = req.params;
  const { title, status, deadline } = req.body;
  const { rows } = await pool.query(
    `UPDATE projects
     SET title=COALESCE($1,title),
         status=COALESCE($2,status),
         deadline=$3,
         updated_at=NOW()
     WHERE id=$4 AND user_id=$5
     RETURNING id, title, status, deadline, created_at, updated_at`,
    [title ?? null, status ?? null, deadline ?? null, id, req.user.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.delete('/:id', authRequired, async (req, res) => {
  const { id } = req.params;
  const { rowCount } = await pool.query('DELETE FROM projects WHERE id=$1 AND user_id=$2', [id, req.user.id]);
  if (rowCount === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

export default router;