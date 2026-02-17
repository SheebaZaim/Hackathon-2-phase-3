#!/bin/bash

# Register
RESPONSE=$(curl -s -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test_$(date +%s)@test.com\",\"password\":\"Pass123\"}")

TOKEN=$(echo "$RESPONSE" | python -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

echo "Token: ${TOKEN:0:30}..."

# Create task with detailed output
echo ""
echo "Creating task..."
curl -v -X POST "http://localhost:8000/api/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Task"}' 2>&1 | grep -E "< HTTP|detail|error"

