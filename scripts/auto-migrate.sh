#!/bin/bash

# =============================================
# AUTO MIGRATION (Using DB Password from ENV)
# =============================================

set -e

echo "🚀 Automated Database Migration"
echo "================================"
echo ""

# Check if running from project root
if [ ! -f "package.json" ]; then
  echo "❌ Please run this script from project root directory"
  exit 1
fi

# Load .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "❌ .env file not found!"
  exit 1
fi

# Check if DB_PASSWORD is set
if [ -z "$SUPABASE_DB_PASSWORD" ]; then
  echo "⚠️  SUPABASE_DB_PASSWORD not found in .env"
  echo ""
  echo "Please add it to your .env file:"
  echo "   SUPABASE_DB_PASSWORD=your_database_password"
  echo ""
  echo "Get your database password from:"
  echo "   https://app.supabase.com/project/xicdommyxzsschupzvsx/settings/database"
  echo ""
  exit 1
fi

# Connection details
PROJECT_REF="xicdommyxzsschupzvsx"
DB_HOST="db.${PROJECT_REF}.supabase.co"
CONN_STRING="postgresql://postgres:${SUPABASE_DB_PASSWORD}@${DB_HOST}:5432/postgres?sslmode=require"

echo "📡 Testing connection..."
if ! psql "$CONN_STRING" -c "SELECT 1;" > /dev/null 2>&1; then
  echo "❌ Connection failed!"
  echo ""
  echo "Please verify:"
  echo "  1. SUPABASE_DB_PASSWORD in .env is correct"
  echo "  2. Network connection"
  echo "  3. Supabase project is accessible"
  exit 1
fi
echo "✅ Connected to database!"
echo ""

# Run migrations
echo "===================================="
echo "📝 STEP 1: Subscription Schema"
echo "===================================="
psql "$CONN_STRING" -f supabase-subscription-schema.sql -v ON_ERROR_STOP=1
echo "✅ Step 1 complete!"
echo ""

echo "===================================="
echo "📝 STEP 2: User-Event Relationship + Event Code"
echo "===================================="
psql "$CONN_STRING" -f supabase-migration-add-user-event-relationship.sql -v ON_ERROR_STOP=1
echo "✅ Step 2 complete!"
echo ""

echo "===================================="
echo "🎉 ALL MIGRATIONS SUCCESSFUL!"
echo "===================================="
echo ""

# Quick verification
echo "📊 Quick Verification:"
psql "$CONN_STRING" -t -c "
SELECT
  '  ✅ ' || COUNT(*) || ' tables created' as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'events', 'packages', 'subscriptions');

SELECT
  '  ✅ Events table has ' || COUNT(*) || ' new columns (user_id, settings, code)' as status
FROM information_schema.columns
WHERE table_name = 'events'
  AND column_name IN ('user_id', 'settings', 'code');

SELECT
  '  ✅ ' || COUNT(*) || ' packages available' as status
FROM packages;

SELECT
  '  ✅ Sample event code: ' || generate_event_code() as status;
"

echo ""
echo "✨ Migration complete! Database is ready."
echo ""
