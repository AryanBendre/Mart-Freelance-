import Database from 'better-sqlite3';

let db: Database.Database;

export async function initializeDb() {
  db = new Database('./database.sqlite');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      original_price REAL,
      image_url TEXT,
      category TEXT NOT NULL,
      stock INTEGER DEFAULT 0,
      unit TEXT DEFAULT '1 unit',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_id TEXT,
      delivery_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    );
  `);

  // Seed initial products if empty
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (productCount.count === 0) {
    const sampleProducts = [
      { name: 'Amul Taaza Toned Fresh Milk', price: 27, original_price: 28, category: 'Dairy & Bread', image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80', unit: '500 ml', stock: 100 },
      { name: 'Farmley Premium California Almonds', price: 349, original_price: 450, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&q=80', unit: '250 g', stock: 50 },
      { name: 'Fresh Onion', price: 35, original_price: 45, category: 'Vegetables', image_url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&q=80', unit: '1 kg', stock: 200 },
      { name: 'Lay\'s India\'s Magic Masala Potato Chips', price: 20, original_price: 20, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1566478989037-e924e50cb0ee?w=500&q=80', unit: '50 g', stock: 150 },
      { name: 'Coca-Cola Original', price: 40, original_price: 40, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80', unit: '750 ml', stock: 80 },
      { name: 'Aashirvaad Shudh Chakki Whole Wheat Atta', price: 235, original_price: 250, category: 'Staples', image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80', unit: '5 kg', stock: 40 },
    ];

    const insertProduct = db.prepare(
      'INSERT INTO products (name, description, price, original_price, image_url, category, stock, unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );

    for (const p of sampleProducts) {
      insertProduct.run(
        p.name, 'Fresh and high quality product delivered in minutes.', p.price, p.original_price, p.image_url, p.category, p.stock, p.unit
      );
    }
  }

  console.log('Database initialized');
}

export function getDb() {
  return db;
}
