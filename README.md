# InstaMart - Online Supermarket

A complete production-ready online supermarket website inspired by Blinkit, Swiggy Instamart, and Zomato Hyperpure.

## Features

### Frontend
- **Tech Stack:** React.js, Tailwind CSS, Zustand, Framer Motion, React Router
- **UI/UX:** Modern, clean, fast-loading UI with smooth animations
- **Pages:** Home, Login/Register, Cart, Checkout, Orders, Admin Dashboard
- **Functionality:**
  - Live category filtering
  - Add/remove from cart with quantity selector
  - Persistent cart state
  - Responsive design (mobile-first)

### Backend
- **Tech Stack:** Node.js, Express.js, SQLite (via `sqlite` and `sqlite3`), JWT, bcryptjs
- **Note on FastAPI:** *The AI Studio environment uses a Node.js runtime, so the backend was built using Express.js instead of FastAPI. However, the REST API structure and endpoints are identical to what you would build in FastAPI.*
- **Features:**
  - JWT-based User Authentication
  - Product Management (CRUD for Admin)
  - Order Management
  - Mock Razorpay Payment Integration

## Setup & Run Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory (or use the provided `.env.example` structure):
   ```env
   JWT_SECRET="your-super-secret-key"
   RAZORPAY_KEY_ID="rzp_test_dummy_key"
   RAZORPAY_KEY_SECRET="dummy_secret"
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   This will start both the Express backend and Vite frontend concurrently.

4. **Build for Production:**
   ```bash
   npm run build
   ```
   Then start the server:
   ```bash
   npm start
   ```

## Admin Access
To access the Admin Dashboard, you need an admin account.
1. Register a new user via the UI.
2. Manually update the user's role to `admin` in the `database.sqlite` file (e.g., using a SQLite viewer or a simple script).
3. Log in again to see the "Admin" link in the navigation bar.

## Deployment Guide

### Frontend (Vercel / Netlify)
1. Push your code to GitHub.
2. Import the repository in Vercel/Netlify.
3. Set the Build Command to `npm run build` and Output Directory to `dist`.
4. Ensure you set the `VITE_API_URL` environment variable if your backend is hosted separately.

### Backend (Render / Railway)
1. Push your code to GitHub.
2. Create a new Web Service in Render/Railway.
3. Set the Build Command to `npm install && npm run build`.
4. Set the Start Command to `npm start`.
5. Add the required Environment Variables (`JWT_SECRET`, `RAZORPAY_KEY_ID`, etc.).
6. **Database:** For production, replace SQLite with PostgreSQL. You can use Supabase or Render's managed PostgreSQL. Update the `db.ts` file to use the `pg` package instead of `sqlite3`.

## Folder Structure
```
/
├── server/
│   ├── db.ts           # SQLite Database initialization & seeding
│   ├── middleware/     # Auth & Admin middlewares
│   └── routes/         # API Routes (auth, products, orders, payment)
├── src/
│   ├── components/     # Reusable UI components (Navbar, ProductCard, CartDrawer)
│   ├── pages/          # Page components (Home, Login, Checkout, etc.)
│   ├── store/          # Zustand state management (auth, cart)
│   ├── lib/            # Utility functions
│   ├── App.tsx         # Main React component & Routing
│   └── main.tsx        # React entry point
├── server.ts           # Express server entry point
├── package.json        # Dependencies & Scripts
└── vite.config.ts      # Vite configuration
```
