import { Router } from 'express';
import { getDb } from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Create order
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const { items, total_amount, delivery_address, payment_id } = req.body;
    const db = getDb();

    // Start transaction
    db.exec('BEGIN TRANSACTION');

    const result = db.prepare(
      'INSERT INTO orders (user_id, total_amount, delivery_address, payment_id, status) VALUES (?, ?, ?, ?, ?)'
    ).run(req.user.id, total_amount, delivery_address, payment_id, 'confirmed');
    const orderId = result.lastInsertRowid;

    const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
    const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

    for (const item of items) {
      insertItem.run(orderId, item.product_id, item.quantity, item.price);
      updateStock.run(item.quantity, item.product_id);
    }

    db.exec('COMMIT');

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    const db = getDb();
    db.exec('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user orders
router.get('/my-orders', authenticateToken, async (req: any, res) => {
  try {
    const db = getDb();
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id) as any[];
    
    const getItems = db.prepare(`
      SELECT oi.*, p.name, p.image_url, p.unit 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ?
    `);

    for (const order of orders) {
      order.items = getItems.all(order.id);
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Get all orders
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const orders = db.prepare(`
      SELECT o.*, u.name as user_name, u.email as user_email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `).all();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Update order status
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const db = getDb();
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
