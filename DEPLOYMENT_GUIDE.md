# Deployment Guide for Aadhaar Insights Hub

This guide will help you deploy your full-stack application as a live website. We will use **Render** for the backend (Node.js + SQLite) and **Vercel** for the frontend (React).

## Part 1: Database (Free & Persistent)

Since Render's free tier does not keep files (SQLite data is lost on restart), we **must** use a free cloud database.

1.  **Sign Up**: Go to [Neon.tech](https://neon.tech) (Free PostgreSQL).
2.  **Create Project**: Name it `aadhaar-db`.
3.  **Get Connection String**: Copy the "Pooled Connection String" (starts with `postgres://...`).
4.  **Update Code**:
    *   In `backend/prisma/schema.prisma`, change:
        ```prisma
        datasource db {
          provider = "postgresql" // Changed from sqlite
          url      = env("DATABASE_URL")
        }
        ```
    *   Delete `backend/prisma/migrations` folder if it exists.

## Part 2: Deploy Backend (Render Free Tier)

1.  **Sign Up/Login**: [Render.com](https://render.com/).
2.  **New Web Service**: Connect your GitHub repo.
3.  **Settings**:
    *   **Root Directory**: `backend`
    *   **Runtime**: Node
    *   **Build Command**: `npm install && npx prisma generate`
    *   **Start Command**: `npm start`
    *   **Instance Type**: Free
4.  **Environment Variables**:
    *   `PORT`: `5000`
    *   `DATABASE_URL`: Paste your **Neon Connection String**.
5.  **Note on Files**: 
    *   On the free tier, uploaded files in `uploads/` will disappear when the server restarts (spins down).
    *   *Solution for future*: Integrate Cloudinary or AWS S3 for file storage.
6.  **Deploy**: Save and wait for the "Live" status. Copy the URL.

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
