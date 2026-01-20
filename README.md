# Aadhaar Insights Hub

A React + TypeScript + Node.js application for visualizing and analyzing Aadhaar transaction data. This dashboard provides insights into enrollment trends, age demographics, and state-wise performance.

## Features

- **Interactive Dashboard**: Visualize trends using Recharts.
- **Data Ingestion**: Support for Excel/CSV file uploads.
- **Backend Analysis**: Node.js + Prisma backend for efficient data aggregation.
- **Responsive Design**: Built with Tailwind CSS and Radix UI.

## Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: TanStack Query

### Backend
- **Runtime**: Node.js (Express)
- **Database**: SQLite (via Prisma ORM)
- **File Handling**: Multer (for uploads), XLSX/CSV-Parser

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/kri-jha/Aadhaar-BI.git
cd aadhaar-insights-hub
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 3. Database Setup (Backend)
 Initialize the SQLite database:
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 4. Running the Application

**Start Backend (Port 5000):**
```bash
cd backend
npm run dev
```

**Start Frontend (Port 8080):**
```bash
# In the root directory
npm run dev
```

## Usage

1. Open the dashboard at `http://localhost:8080`.
2. View the pre-loaded analytics or upload a new dataset via the "Upload Analysis" feature.
3. Check `KEY_FINDINGS.md` for a summary of the latest data insights.

## Project Structure
- `src/`: Frontend React components and pages.
- `backend/src/`: Express server and API routes.
- `backend/prisma/`: Database schema and migrations.
- `backend/analysis_notebook.ts`: Script for generating analysis reports.
