import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.json({ user: req.user });
  } catch (err) {
    console.error("❌ Me route error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;