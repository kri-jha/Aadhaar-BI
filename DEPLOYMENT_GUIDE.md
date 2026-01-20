# Deployment Guide for Aadhaar Insights Hub

This guide will help you deploy your full-stack application as a live website. We will use **Render** for the backend (Node.js + SQLite) and **Vercel** for the frontend (React).

## Part 1: Deploy Backend (Render)

1. **Sign Up/Login**: Go to [Render.com](https://render.com/) and log in with GitHub.
2. **New Web Service**:
   - Click **New +** -> **Web Service**.
   - Select "Build and deploy from a Git repository".
   - Connect your **Aadhaar-BI** repository.
3. **Configure Service**:
   - **Name**: `aadhaar-backend`
   - **Region**: Singapore (or nearest to you)
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
4. **Environment Variables**:
   - Add a key `PORT` with value `5000`.
   - Add a key `DATABASE_URL` with value `file:/var/data/dev.db` (if using a disk) or `file:./dev.db`.
5. **Persistent Storage (Important)**:
   - Since you use SQLite and file uploads, you need a persistent disk to keep data across restarts.
   - In Render settings, add a **Disk** (requires paid plan ~7$/mo):
     - **Name**: `aadhaar-data`
     - **Mount Path**: `/var/data`
     - **Size**: 1 GB is enough.
   - *Note: If you use the Free Tier, your database and uploads will be wiped every time the server spins down (approx every 15 mins of inactivity).*
6. **Deploy**: Click "Create Web Service". Wait for it to go live.
7. **Copy URL**: Save your new backend URL (e.g., `https://aadhaar-backend.onrender.com`).

---

## Part 2: Deploy Frontend (Vercel)

1. **Sign Up/Login**: Go to [Vercel.com](https://vercel.com/) and log in with GitHub.
2. **Add New Project**:
   - Click **Add New** -> **Project**.
   - Import the **Aadhaar-BI** repository.
3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (leave as default)
4. **Environment Variables**:
   - Click "Environment Variables".
   - Add `VITE_API_URL`.
   - **Value**: Your Render Backend URL + `/api` (e.g., `https://aadhaar-backend.onrender.com/api`).
   - *Example*: If Render gives `https://aadhaar-backend.onrender.com`, set `VITE_API_URL` to `https://aadhaar-backend.onrender.com/api`.
5. **Deploy**: Click **Deploy**.
6. **Done**: Your website is now live!

## Troubleshooting

- **CORS Issues**: If the frontend cannot fetch data, you may need to update `backend/src/server.ts` to explicitly allow the Vercel domain.
- **Micro-Frontend/State Issues**: If moving to a production database (PostgreSQL) is preferred later, you can update `schema.prisma` and use Supabase or Neon.tech with Vercel.
