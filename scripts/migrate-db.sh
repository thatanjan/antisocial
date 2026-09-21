#!/bin/bash
# scripts/migrate-db.sh
# Run Prisma migrations against the database
# Usage: ./scripts/migrate-db.sh [environment]
# Environment: development (default), staging, production

set -euo pipefail

ENVIRONMENT="${1:-development}"

echo "🔄 Running Prisma migrations for environment: $ENVIRONMENT"

# Load environment-specific .env file if it exists
if [[ -f ".env.${ENVIRONMENT}" ]]; then
    echo "📦 Loading environment from .env.${ENVIRONMENT}"
    export $(grep -v '^#' ".env.${ENVIRONMENT}" | xargs)
elif [[ -f ".env.local" ]]; then
    echo "📦 Loading environment from .env.local"
    export $(grep -v '^#' ".env.local" | xargs)
fi

# Verify DATABASE_URL is set
if [[ -z "${DATABASE_URL:-}" ]]; then
    echo "❌ ERROR: DATABASE_URL is not set"
    echo "   Set DATABASE_URL in .env.${ENVIRONMENT} or .env.local"
    exit 1
fi

echo "📊 Database URL: ${DATABASE_URL%%:*}://***@${DATABASE_URL#*@}"

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🚀 Applying database migrations..."
npx prisma migrate deploy

echo "✅ Migrations completed successfully!"