import express from "express";
import { pool } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Створити замовлення (кошик → замовлення)
router.post("/", authMiddleware, async (req, res) => {
  const { items } = req.body; 
  // items = [{ product_id: 1, quantity: 2 }, ...]

  try {
    // 1. Створюємо замовлення
    const orderResult = await pool.query(
      "INSERT INTO orders (user_id, status, total_price) VALUES ($1, 'pending', 0) RETURNING *",
      [req.user.id]
    );
    const order = orderResult.rows[0];

    let total = 0;

    // 2. Додаємо товари у order_items
    for (const item of items) {
      const productRes = await pool.query("SELECT * FROM products WHERE id=$1", [item.product_id]);
      const product = productRes.rows[0];
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ error: "Not enough stock" });
      }

      const price = product.price * item.quantity;
      total += price;

      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)",
        [order.id, product.id, item.quantity, price]
      );

      // 3. Оновлюємо stock
      await pool.query("UPDATE products SET stock=stock-$1 WHERE id=$2", [item.quantity, product.id]);
    }

    // 4. Оновлюємо total_price
    await pool.query("UPDATE orders SET total_price=$1 WHERE id=$2", [total, order.id]);

    res.json({ ...order, total_price: total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// Отримати замовлення користувача
router.get("/", authMiddleware, async (req, res) => {
  const result = await pool.query("SELECT * FROM orders WHERE user_id=$1", [req.user.id]);
  res.json(result.rows);
});

export default router;