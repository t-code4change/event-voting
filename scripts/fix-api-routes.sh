#!/bin/bash

# Script to add 'export const dynamic = "force-dynamic"' to all API routes
# This fixes the "couldn't be rendered statically" error in Next.js 14

API_ROUTES=(
  "app/api/admin/candidates/route.ts"
  "app/api/admin/dashboard/stats/route.ts"
  "app/api/admin/events/route.ts"
  "app/api/admin/results/route.ts"
  "app/api/admin/settings/route.ts"
  "app/api/admin/stats/route.ts"
  "app/api/events/active/route.ts"
  "app/api/events/[eventId]/categories/route.ts"
  "app/api/invoices/route.ts"
  "app/api/stats/route.ts"
  "app/api/subscriptions/active/route.ts"
)

for route in "${API_ROUTES[@]}"; do
  file="/Users/tuanpham/MyLife/CRM-Pacificwide/event-voting/$route"

  if [ -f "$file" ]; then
    # Check if already has the export
    if ! grep -q "export const dynamic" "$file"; then
      echo "Fixing: $route"

      # Add export after imports (before first export function/const)
      sed -i '' '1a\
\
export const dynamic = '\''force-dynamic'\''
' "$file"
    else
      echo "Skipped (already fixed): $route"
    fi
  else
    echo "File not found: $route"
  fi
done

echo "✅ Done fixing API routes!"
