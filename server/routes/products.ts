import { Router } from 'express';
import { getDb } from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { category, search } = req.query;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    const products = db.prepare(query).all(...params);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Add product
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, original_price, image_url, category, stock, unit } = req.body;
    const db = getDb();

    const result = db.prepare(
      'INSERT INTO products (name, description, price, original_price, image_url, category, stock, unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(name, description, price, original_price, image_url, category, stock, unit);

    res.status(201).json({ message: 'Product created', id: result.lastInsertRowid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Update product
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, original_price, image_url, category, stock, unit } = req.body;
    const db = getDb();

    db.prepare(
      'UPDATE products SET name=?, description=?, price=?, original_price=?, image_url=?, category=?, stock=?, unit=? WHERE id=?'
    ).run(name, description, price, original_price, image_url, category, stock, unit, req.params.id);

    res.json({ message: 'Product updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Delete product
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM products WHERE id=?').run(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
