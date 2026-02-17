#!/bin/bash

# Test script for deployment fixes

echo "========================================="
echo "Testing Deployment Fixes"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Backend Health
echo "Test 1: Backend Health Check"
echo "-------------------------------------"
BACKEND_URL="http://localhost:8000"

if curl -s -f "${BACKEND_URL}/health" > /dev/null; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
    curl -s "${BACKEND_URL}/health" | python -m json.tool 2>/dev/null || echo "Response received"
else
    echo -e "${RED}✗ Backend is not responding${NC}"
    echo "Please start backend: cd backend && uvicorn src.main:app --reload"
    exit 1
fi

echo ""

# Test 2: Check OpenAI Configuration
echo "Test 2: OpenAI API Key Configuration"
echo "-------------------------------------"
cd backend
OPENAI_CHECK=$(python -c "
import os
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv('OPENAI_API_KEY', '')
if api_key and len(api_key) > 20:
    print('OK')
else:
    print('MISSING')
" 2>/dev/null)

if [ "$OPENAI_CHECK" = "OK" ]; then
    echo -e "${GREEN}✓ OpenAI API key is configured${NC}"
else
    echo -e "${RED}✗ OpenAI API key is missing or invalid${NC}"
    echo "Please check backend/.env file"
fi
cd ..

echo ""

# Test 3: Frontend Environment
echo "Test 3: Frontend Environment Configuration"
echo "-------------------------------------"
if [ -f "frontend/.env.local" ]; then
    echo -e "${GREEN}✓ frontend/.env.local exists${NC}"
    echo "Backend URL: $(grep NEXT_PUBLIC_BACKEND_URL frontend/.env.local | cut -d'=' -f2)"
else
    echo -e "${YELLOW}⚠ frontend/.env.local not found${NC}"
    echo "Using default: http://localhost:8000"
fi

echo ""

# Test 4: Test Auth Endpoint
echo "Test 4: Testing Auth Endpoint (Register)"
echo "-------------------------------------"
TEST_EMAIL="test_$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123"

REGISTER_RESPONSE=$(curl -s -X POST "${BACKEND_URL}/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\"}" \
    -w "\nHTTP_CODE:%{http_code}")

HTTP_CODE=$(echo "$REGISTER_RESPONSE" | grep "HTTP_CODE" | cut -d':' -f2)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Auth endpoint is working${NC}"
    echo "Successfully created test user: ${TEST_EMAIL}"
else
    echo -e "${RED}✗ Auth endpoint returned HTTP $HTTP_CODE${NC}"
    echo "Response: $(echo "$REGISTER_RESPONSE" | grep -v HTTP_CODE)"
fi

echo ""

# Test 5: Database Connection
echo "Test 5: Database Connection"
echo "-------------------------------------"
cd backend
DB_CHECK=$(python -c "
from sqlmodel import Session, create_engine
import os
from dotenv import load_dotenv
load_dotenv()
db_url = os.getenv('DATABASE_URL', '')
if db_url:
    try:
        engine = create_engine(db_url)
        with Session(engine) as session:
            session.exec('SELECT 1')
        print('CONNECTED')
    except Exception as e:
        print(f'ERROR: {str(e)}')
else:
    print('NO_URL')
" 2>&1)

if [ "$DB_CHECK" = "CONNECTED" ]; then
    echo -e "${GREEN}✓ Database connection successful${NC}"
elif [ "$DB_CHECK" = "NO_URL" ]; then
    echo -e "${RED}✗ DATABASE_URL not configured${NC}"
else
    echo -e "${RED}✗ Database connection failed${NC}"
    echo "Error: $DB_CHECK"
fi
cd ..

echo ""

# Summary
echo "========================================="
echo "Test Summary"
echo "========================================="
echo ""
echo "If all tests passed, you can now:"
echo "1. Start the frontend: cd frontend && npm run dev"
echo "2. Visit http://localhost:3000"
echo "3. Test register/login (should work without network errors)"
echo "4. Test AI chat (should work multiple times)"
echo ""
echo "To deploy to production:"
echo "1. Update frontend/.env.production with correct backend URL"
echo "2. Deploy backend to Hugging Face Space"
echo "3. Deploy frontend to Vercel"
echo "4. Test both issues in production environment"
