#!/bin/bash

echo "Testing Task API with Authentication"
echo "===================================="
echo ""

# Step 1: Register a test user
echo "1. Registering test user..."
TEST_EMAIL="test_api_$(date +%s)@example.com"
TEST_PASSWORD="TestPass123"

REGISTER_RESPONSE=$(curl -s -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

TOKEN=$(echo "$REGISTER_RESPONSE" | python -c "import sys, json; data=json.load(sys.stdin); print(data.get('access_token', ''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token"
  echo "Response: $REGISTER_RESPONSE"
  exit 1
fi

echo "✅ Token received: ${TOKEN:0:20}..."
echo ""

# Step 2: Create a task
echo "2. Creating a task..."
CREATE_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Task from API"}')

echo "Response: $CREATE_RESPONSE"
echo ""

# Step 3: List tasks
echo "3. Listing tasks..."
LIST_RESPONSE=$(curl -s -X GET "http://localhost:8000/api/tasks" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $LIST_RESPONSE"
echo ""

echo "===================================="
echo "Test complete!"
