# Quickstart: Project Setup

**Feature**: Project Setup (Dockerized Next.js)

## Prerequisites
- Docker & Docker Compose
- Node.js 18+ (Optional, if running outside Docker)

## Running the App (Docker - Recommended)
The entire application stack is containerized.

1. **Setup Environment**
   ```bash
   cp .env.example .env
   ```

2. **Start Services**
   ```bash
   docker-compose up --build
   ```
   - Frontend: `http://localhost:3000`
   - Database: `localhost:5432`

## Running the App (Host Mode - Alternative)
If you prefer running Node locally and DB in Docker:

1. **Start Database Only**
   ```bash
   docker-compose up -d db
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   - URL: `http://localhost:3000`

## Verification
- Visit `http://localhost:3000` - Should see Next.js/Shadcn landing page.
- Check `docker-compose logs db` - Should see PostgreSQL ready.
