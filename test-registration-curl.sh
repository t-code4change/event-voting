#!/bin/bash

# Test Registration with curl
SUPABASE_URL="https://xicdommyxzsschupzvsx.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpY2RvbW15eHpzc2NodXB6dnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMDIwMjYsImV4cCI6MjA0Njg3ODAyNn0.6r9QJ4F3pWP5RwqQrSbxmFqh9fmvYxGr9Ur_5q3wUfQ"

# Generate random test email
TEST_EMAIL="test_$(date +%s)@example.com"
TEST_PASSWORD="12341234"

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║     🧪 TESTING REGISTRATION WITH CURL            ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""
echo "Test Email: $TEST_EMAIL"
echo "Test Password: $TEST_PASSWORD"
echo ""
echo "Sending request to Supabase Auth..."
echo ""

# Make the request
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST "$SUPABASE_URL/auth/v1/signup" \
  -H "Content-Type: application/json" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"data\": {},
    \"gotrue_meta_security\": {},
    \"code_challenge\": null,
    \"code_challenge_method\": null
  }")

# Extract status code
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
RESPONSE_BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo "═══════════════ RESPONSE ═══════════════"
echo "Status Code: $HTTP_STATUS"
echo ""
echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
echo ""
echo "═══════════════════════════════════════"
echo ""

# Check if successful
if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "201" ]; then
  echo "✅ ✅ ✅ REGISTRATION SUCCESSFUL! ✅ ✅ ✅"
  echo ""
  echo "User registered successfully!"
  echo "Now checking database..."
  echo ""
else
  echo "❌ ❌ ❌ REGISTRATION FAILED! ❌ ❌ ❌"
  echo ""
  echo "Error: $(echo "$RESPONSE_BODY" | jq -r '.message // .msg // .error_description // "Unknown error"' 2>/dev/null || echo "Unknown error")"
  echo ""
fi
