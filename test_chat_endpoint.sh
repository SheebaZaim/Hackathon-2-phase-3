#!/bin/bash

echo "Testing Chat Endpoint End-to-End"
echo "================================"

# Register test user
EMAIL="test_chat_$(date +%s)@test.com"
echo "1. Registering user: $EMAIL"

REG_RESP=$(curl -s -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"Test123\"}")

TOKEN=$(echo "$REG_RESP" | python -c "import sys, json; print(json.load(sys.stdin).get('access_token', 'ERROR'))" 2>/dev/null)
USER_ID=$(echo "$REG_RESP" | python -c "import sys, json; import jwt; token=json.load(sys.stdin).get('access_token'); payload=jwt.decode(token, options={'verify_signature': False}); print(payload.get('sub', 'ERROR'))" 2>/dev/null)

if [ "$TOKEN" = "ERROR" ]; then
    echo "Failed to register"
    exit 1
fi

echo "Token: ${TOKEN:0:30}..."
echo "User ID: $USER_ID"
echo ""

# Try chat
echo "2. Sending chat message..."
CHAT_RESP=$(curl -s -w "\nHTTP:%{http_code}" -X POST "http://localhost:8000/api/$USER_ID/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message":"Hello"}')

HTTP_CODE=$(echo "$CHAT_RESP" | grep "HTTP:" | cut -d':' -f2)
BODY=$(echo "$CHAT_RESP" | grep -v "HTTP:")

echo "HTTP Code: $HTTP_CODE"
echo "Response:"
echo "$BODY" | python -m json.tool 2>/dev/null || echo "$BODY"
