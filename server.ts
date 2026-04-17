import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. IMPORT YOUR DB & ROUTES (Uncommented!)
import { initializeDb } from './server/db.js';
import authRoutes from './server/routes/auth.js';
import productRoutes from './server/routes/products.js';
import orderRoutes from './server/routes/orders.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 2. MOUNT YOUR API ROUTES (Uncommented!)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Initialize Database 
initializeDb().then(() => console.log("Database initialized and seeded!"));

// 3. HUGGING FACE / DOCKER FRONTEND HOSTING FIXES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route: send any unknown requests (like React Router links) to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// 4. START SERVER
const PORT = process.env.PORT || 7860;

app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
