# Antisocial
A modern social media application foundation.

## 🚀 Quickstart

### Prerequisites
- Node.js 20+
- PostgreSQL (local or remote)

### Running the App

1. **Setup Environment**:
   ```bash
   cp .env.example .env
   # Update DATABASE_URL in .env with your PostgreSQL connection
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Database Setup**:
   ```bash
   npx prisma db push
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Access**: http://localhost:3000

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
