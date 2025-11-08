#!/bin/bash

# =============================================
# AUTO RUN ALL MIGRATIONS
# =============================================

set -e  # Exit on error

echo "🚀 Starting Automated Migrations..."
echo "===================================="
echo ""

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Extract project ref from Supabase URL
PROJECT_REF="xicdommyxzsschupzvsx"

# Construct connection string
# Note: Supabase uses postgres user with the database password, not service role key
# You need to get the database password from Supabase Dashboard > Settings > Database
echo "⚠️  IMPORTANT: This script needs your Supabase DATABASE PASSWORD"
echo "   (NOT the service role key)"
echo ""
echo "   Get it from: https://app.supabase.com/project/$PROJECT_REF/settings/database"
echo ""
read -sp "Enter your Supabase database password: " DB_PASSWORD
echo ""
echo ""

# Connection string format for Supabase
DB_HOST="db.${PROJECT_REF}.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"

# Full connection string
CONN_STRING="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require"

echo "📡 Testing connection..."
if ! psql "$CONN_STRING" -c "SELECT version();" > /dev/null 2>&1; then
  echo "❌ Connection failed! Please check:"
  echo "   1. Database password is correct"
  echo "   2. Network connection is stable"
  echo "   3. Supabase project is accessible"
  exit 1
fi
echo "✅ Connection successful!"
echo ""

# Migration files in order
MIGRATIONS=(
  "supabase-subscription-schema.sql"
  "supabase-migration-add-user-event-relationship.sql"
)

# Run each migration
for i in "${!MIGRATIONS[@]}"; do
  MIGRATION_FILE="${MIGRATIONS[$i]}"
  STEP=$((i + 1))

  echo "===================================="
  echo "📝 STEP $STEP: $MIGRATION_FILE"
  echo "===================================="
  echo ""

  if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ File not found: $MIGRATION_FILE"
    exit 1
  fi

  echo "⏳ Running migration..."

  # Run the SQL file
  if psql "$CONN_STRING" -f "$MIGRATION_FILE" -v ON_ERROR_STOP=1; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo ""
  else
    echo ""
    echo "❌ Migration failed!"
    echo ""
    echo "Please check the error above and fix before continuing."
    exit 1
  fi

  sleep 1
done

echo "===================================="
echo "🎉 ALL MIGRATIONS COMPLETED!"
echo "===================================="
echo ""
echo "✅ Subscription schema created"
echo "✅ User-event relationship added"
echo "✅ Event code feature added"
echo ""
echo "📊 Verifying..."
echo ""

# Verification queries
psql "$CONN_STRING" << 'EOF'
-- Check tables exist
SELECT
  CASE
    WHEN COUNT(*) = 11 THEN '✅ All tables exist'
    ELSE '❌ Missing tables: ' || (11 - COUNT(*))::text
  END as table_check
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'users', 'packages', 'subscriptions', 'invoices',
    'transactions', 'subscription_history',
    'events', 'categories', 'candidates', 'voters', 'votes'
  );

-- Check events columns
SELECT
  column_name,
  data_type,
  CASE
    WHEN column_name IN ('user_id', 'settings', 'code') THEN '✅ NEW'
    ELSE ''
  END as status
FROM information_schema.columns
WHERE table_name = 'events'
  AND column_name IN ('id', 'name', 'user_id', 'settings', 'code')
ORDER BY
  CASE column_name
    WHEN 'id' THEN 1
    WHEN 'name' THEN 2
    WHEN 'user_id' THEN 3
    WHEN 'settings' THEN 4
    WHEN 'code' THEN 5
  END;

-- Check packages
SELECT
  '✅ ' || COUNT(*) || ' packages found' as package_check,
  STRING_AGG(name, ', ') as packages
FROM packages;

-- Test generate event code
SELECT
  '✅ Sample event code: ' || generate_event_code() as code_test;
EOF

echo ""
echo "===================================="
echo "✨ Setup Complete!"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Create a test user in Supabase Auth Dashboard"
echo "2. Create subscription for that user"
echo "3. Test creating events with user_id"
echo ""
echo "Happy coding! 🚀"
echo ""
