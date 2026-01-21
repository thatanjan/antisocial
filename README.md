# Antisocial
A modern social media application foundation.

## 🚀 Quickstart (Docker)

The easiest way to run the application and all dependencies (Postgres, etc.) is via Docker Compose.

### Prerequisites
- Docker & Docker Compose
- Node.js (for local tooling/commands)

### Running the App

1. **Setup Environment**:
   ```bash
   cp .env.example .env
   # Update .env with your secrets if needed (defaults work for dev)
   ```

2. **Start Services**:
   ```bash
   docker-compose up --build
   ```
   This will start:
   - **App**: http://localhost:3000
   - **Database**: localhost:5432 (Postgres)

3. **Database Setup**:
   Open a new terminal and run:
   ```bash
   npx prisma db push
   ```

### Development Mode

For faster development with hot-reloading:

1. **Start only the database**:
   ```bash
   docker-compose up -d db
   ```

2. **Run the app locally**:
   ```bash
   npm run dev
   ```

3. **Access**: http://localhost:3000

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Database**: PostgreSQL (via Prisma ORM)
- **Auth**: Better Auth
- **Logger**: Pino

## 🩺 Health Check

Check if the API is running:
- `GET /api/health` -> `{ status: "ok", timestamp: "..." }`
