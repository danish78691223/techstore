# Tech Nexus — MERN Migration

Converted from the supplied PHP/MySQL Tech Store project to React + Vite, Node.js + Express, and MongoDB/Mongoose.

## Requirements
- Node.js 18+
- MongoDB local or MongoDB Atlas

## Run backend
```bash
cd backend
copy .env.example .env
npm install
npm run dev
```
Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` in `.env`.

## Run frontend
```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Default URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Create admin
For the first admin, temporarily set `ALLOW_ADMIN_SEED=true` in backend `.env`, then POST `/api/auth/seed-admin` with optional `{email,password}`. Remove/disable the variable afterward.

## Product images
The original images from the supplied PHP project were copied to `frontend/public/uploads/`. New admin uploads are stored in `backend/uploads/` and served from `/uploads/...`.

## Main API
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET/POST/PUT/DELETE /api/products
- POST /api/orders
- GET /api/orders/my
- GET/PATCH /api/orders (admin)
- GET /api/admin/dashboard
