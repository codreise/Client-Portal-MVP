// backend/src/routes/me.js
import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.get('/', authRequired, async (req, res) => {
  res.json({ user: req.user });
});
export default router;