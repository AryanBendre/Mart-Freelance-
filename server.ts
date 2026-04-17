import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ----------------------------------------------------
// 1. IMPORT YOUR DB & ROUTES (Keep your existing ones)
// ----------------------------------------------------
// Example:
// import { initializeDB } from './server/db.js';
// import authRoutes from './server/routes/auth.js';
// import productRoutes from './server/routes/products.js';
// import orderRoutes from './server/routes/orders.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// 2. MOUNT YOUR API ROUTES
// ----------------------------------------------------
// Example:
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);

// Initialize Database (if you have an init function)
// initializeDB().then(() => console.log("Database initialized"));


// ----------------------------------------------------
// 3. HUGGING FACE / DOCKER FRONTEND HOSTING FIXES
// ----------------------------------------------------

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route: send any unknown requests (like React Router links) to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// ----------------------------------------------------
// 4. START SERVER (0.0.0.0 is required for Docker)
// ----------------------------------------------------
const PORT = process.env.PORT || 7860;

app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
