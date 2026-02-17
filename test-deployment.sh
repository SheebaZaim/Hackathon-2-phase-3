#!/bin/bash
# Test Todo App Deployment
# Run this after completing deployment to verify everything works

echo "════════════════════════════════════════════════════════"
echo " 🧪 Testing Todo App Deployment"
echo "════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BACKEND_URL="https://sheeba0321-hackathon-2-phase-2.hf.space"

echo "📡 Testing Backend..."
echo "URL: $BACKEND_URL"
echo ""

# Test 1: Health Check
echo -n "1. Health Check: "
HEALTH=$(curl -s "$BACKEND_URL/health")
if echo "$HEALTH" | grep -q '"database":"connected"'; then
    echo -e "${GREEN}✅ PASS${NC} - Database connected"
    echo "   Response: $HEALTH"
else
    echo -e "${RED}❌ FAIL${NC} - Database not connected"
    echo "   Response: $HEALTH"
    echo ""
    echo -e "${YELLOW}⚠️  ACTION NEEDED:${NC} Fix DATABASE_URL in Hugging Face Spaces"
    echo "   Make sure there are NO spaces in 'neon.tech'"
fi
echo ""

# Test 2: API Documentation
echo -n "2. API Docs Accessible: "
DOCS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/docs")
if [ "$DOCS" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Swagger UI accessible"
    echo "   URL: $BACKEND_URL/docs"
else
    echo -e "${RED}❌ FAIL${NC} - Cannot access API docs"
fi
echo ""

# Test 3: CORS Headers
echo -n "3. CORS Configuration: "
CORS=$(curl -s -I -H "Origin: https://example.vercel.app" "$BACKEND_URL/health" | grep -i "access-control")
if [ -n "$CORS" ]; then
    echo -e "${GREEN}✅ PASS${NC} - CORS headers present"
    echo "$CORS" | sed 's/^/   /'
else
    echo -e "${YELLOW}⚠️  WARNING${NC} - No CORS headers detected"
fi
echo ""

# Test 4: Register Endpoint (structure test)
echo -n "4. Register Endpoint: "
REGISTER=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BACKEND_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{}')
if [ "$REGISTER" = "422" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Endpoint responding (422 = validation error expected)"
elif [ "$REGISTER" = "500" ]; then
    echo -e "${RED}❌ FAIL${NC} - Server error (500)"
    echo -e "   ${YELLOW}Database connection issue${NC}"
else
    echo -e "${YELLOW}⚠️  UNKNOWN${NC} - Status code: $REGISTER"
fi
echo ""

# Test 5: Login Endpoint (structure test)
echo -n "5. Login Endpoint: "
LOGIN=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BACKEND_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}')
if [ "$LOGIN" = "401" ] || [ "$LOGIN" = "422" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Endpoint responding (401/422 expected without valid user)"
elif [ "$LOGIN" = "500" ]; then
    echo -e "${RED}❌ FAIL${NC} - Server error (500)"
    echo -e "   ${YELLOW}Database connection issue${NC}"
else
    echo -e "${YELLOW}⚠️  UNKNOWN${NC} - Status code: $LOGIN"
fi
echo ""

echo "════════════════════════════════════════════════════════"
echo " 📊 Summary"
echo "════════════════════════════════════════════════════════"
echo ""

if echo "$HEALTH" | grep -q '"database":"connected"'; then
    echo -e "${GREEN}✅ Backend is ready!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Deploy frontend to Vercel (see DEPLOY_NOW.md Step 2)"
    echo "2. Test sign up/login from browser"
    echo "3. Create tasks and verify CRUD operations"
else
    echo -e "${RED}❌ Backend needs attention${NC}"
    echo ""
    echo "Action required:"
    echo "1. Go to: https://huggingface.co/spaces/Sheeba0321/hackathon-2-phase-2/settings"
    echo "2. Fix DATABASE_URL secret (remove spaces from hostname)"
    echo "3. Wait for restart, then run this script again"
fi
echo ""

echo "════════════════════════════════════════════════════════"
echo ""
echo "💡 Tips:"
echo "- Backend API Docs: $BACKEND_URL/docs"
echo "- Backend Health: $BACKEND_URL/health"
echo "- Full deployment guide: DEPLOY_NOW.md"
echo ""
