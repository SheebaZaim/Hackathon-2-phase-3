#!/bin/bash

# Todo App Deployment Verification Script
# Tests both backend and frontend deployments end-to-end

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="https://sheeba0321-hackathon-2-phase-2.hf.space"
FRONTEND_URL="${1:-http://localhost:3000}"  # Accept Vercel URL as argument, default to localhost

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Todo App Deployment Verification${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Backend URL:${NC} $BACKEND_URL"
echo -e "${YELLOW}Frontend URL:${NC} $FRONTEND_URL"
echo ""

# Test counter
PASSED=0
FAILED=0
TOTAL=0

# Function to test an endpoint
test_endpoint() {
    local test_name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    local method="${4:-GET}"
    local data="${5:-}"
    local extra_args="${6:-}"

    TOTAL=$((TOTAL + 1))
    echo -n "Testing: $test_name ... "

    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -d "$data" \
            $extra_args 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" $extra_args 2>&1)
    fi

    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}PASSED${NC} (HTTP $status_code)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}FAILED${NC} (Expected: $expected_status, Got: $status_code)"
        echo -e "${YELLOW}Response:${NC} $body"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# Function to test JSON response content
test_json_field() {
    local test_name="$1"
    local url="$2"
    local field="$3"
    local expected_value="$4"

    TOTAL=$((TOTAL + 1))
    echo -n "Testing: $test_name ... "

    response=$(curl -s "$url" 2>&1)
    actual_value=$(echo "$response" | grep -o "\"$field\":\"[^\"]*\"" | cut -d'"' -f4)

    if [ "$actual_value" = "$expected_value" ]; then
        echo -e "${GREEN}PASSED${NC} ($field: $actual_value)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}FAILED${NC} (Expected: $expected_value, Got: $actual_value)"
        echo -e "${YELLOW}Full Response:${NC} $response"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo -e "${BLUE}=== Backend Health Checks ===${NC}"
echo ""

# Test 1: Backend is accessible
test_endpoint "Backend reachable" "$BACKEND_URL/health" 200

# Test 2: Database connection
if test_json_field "Database connected" "$BACKEND_URL/health" "database" "connected"; then
    echo -e "${GREEN}  ✓ Database is properly connected${NC}"
else
    echo -e "${RED}  ✗ Database connection failed!${NC}"
    echo -e "${YELLOW}  → Action: Fix DATABASE_URL in Hugging Face Spaces${NC}"
    echo -e "${YELLOW}  → See: backend/FIX_DATABASE_URL.md${NC}"
fi

# Test 3: API docs accessible
test_endpoint "API docs available" "$BACKEND_URL/docs" 200

# Test 4: OpenAPI spec
test_endpoint "OpenAPI spec" "$BACKEND_URL/openapi.json" 200

echo ""
echo -e "${BLUE}=== Backend API Endpoints ===${NC}"
echo ""

# Test 5: CORS preflight
test_endpoint "CORS preflight (OPTIONS)" "$BACKEND_URL/api/auth/login" 200 OPTIONS "" "-H 'Origin: $FRONTEND_URL' -H 'Access-Control-Request-Method: POST'"

# Test 6: Register endpoint (should fail without data, but endpoint exists)
test_endpoint "Register endpoint exists" "$BACKEND_URL/api/auth/register" 422 POST

# Test 7: Login endpoint (should fail without data, but endpoint exists)
test_endpoint "Login endpoint exists" "$BACKEND_URL/api/auth/login" 422 POST

echo ""
echo -e "${BLUE}=== Frontend Checks ===${NC}"
echo ""

# Test 8: Frontend is accessible
test_endpoint "Frontend home page" "$FRONTEND_URL/" 200

# Test 9: Login page
test_endpoint "Login page" "$FRONTEND_URL/login" 200

# Test 10: Register page
test_endpoint "Register page" "$FRONTEND_URL/register" 200

# Test 11: Dashboard page (should be accessible, may redirect if not authenticated)
test_endpoint "Dashboard page" "$FRONTEND_URL/dashboard" 200

echo ""
echo -e "${BLUE}=== End-to-End Authentication Flow ===${NC}"
echo ""

# Generate random test user
TEST_EMAIL="test_$(date +%s)@example.com"
TEST_PASSWORD="TestPass123!"
TEST_NAME="Test User"

echo -e "${YELLOW}Creating test user:${NC} $TEST_EMAIL"

# Test 12: Register a new user
REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"name\":\"$TEST_NAME\"}" 2>&1)

REGISTER_STATUS=$(echo "$REGISTER_RESPONSE" | tail -n1)
REGISTER_BODY=$(echo "$REGISTER_RESPONSE" | head -n-1)

TOTAL=$((TOTAL + 1))
echo -n "Testing: User registration ... "
if [ "$REGISTER_STATUS" = "200" ] || [ "$REGISTER_STATUS" = "201" ]; then
    echo -e "${GREEN}PASSED${NC} (HTTP $REGISTER_STATUS)"
    PASSED=$((PASSED + 1))

    # Extract token if present
    TOKEN=$(echo "$REGISTER_BODY" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$TOKEN" ]; then
        echo -e "${GREEN}  ✓ Received auth token${NC}"
    fi
else
    echo -e "${RED}FAILED${NC} (HTTP $REGISTER_STATUS)"
    echo -e "${YELLOW}Response:${NC} $REGISTER_BODY"
    FAILED=$((FAILED + 1))
fi

# Test 13: Login with created user
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" 2>&1)

LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | tail -n1)
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | head -n-1)

TOTAL=$((TOTAL + 1))
echo -n "Testing: User login ... "
if [ "$LOGIN_STATUS" = "200" ]; then
    echo -e "${GREEN}PASSED${NC} (HTTP $LOGIN_STATUS)"
    PASSED=$((PASSED + 1))

    # Extract token
    TOKEN=$(echo "$LOGIN_BODY" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$TOKEN" ]; then
        echo -e "${GREEN}  ✓ Received auth token${NC}"

        # Test 14: Access protected endpoint with token
        TOTAL=$((TOTAL + 1))
        echo -n "Testing: Authenticated task list access ... "

        TASKS_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BACKEND_URL/api/tasks" \
            -H "Authorization: Bearer $TOKEN" 2>&1)

        TASKS_STATUS=$(echo "$TASKS_RESPONSE" | tail -n1)

        if [ "$TASKS_STATUS" = "200" ]; then
            echo -e "${GREEN}PASSED${NC} (HTTP $TASKS_STATUS)"
            PASSED=$((PASSED + 1))
        else
            echo -e "${RED}FAILED${NC} (HTTP $TASKS_STATUS)"
            FAILED=$((FAILED + 1))
        fi
    fi
else
    echo -e "${RED}FAILED${NC} (HTTP $LOGIN_STATUS)"
    echo -e "${YELLOW}Response:${NC} $LOGIN_BODY"
    FAILED=$((FAILED + 1))
fi

# Test 15: Create a task
if [ -n "$TOKEN" ]; then
    TOTAL=$((TOTAL + 1))
    echo -n "Testing: Create task ... "

    CREATE_TASK_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/tasks" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"title\":\"Deployment Test Task\",\"description\":\"Created by verification script\",\"status\":\"pending\"}" 2>&1)

    CREATE_TASK_STATUS=$(echo "$CREATE_TASK_RESPONSE" | tail -n1)
    CREATE_TASK_BODY=$(echo "$CREATE_TASK_RESPONSE" | head -n-1)

    if [ "$CREATE_TASK_STATUS" = "200" ] || [ "$CREATE_TASK_STATUS" = "201" ]; then
        echo -e "${GREEN}PASSED${NC} (HTTP $CREATE_TASK_STATUS)"
        PASSED=$((PASSED + 1))

        # Extract task ID
        TASK_ID=$(echo "$CREATE_TASK_BODY" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
        if [ -n "$TASK_ID" ]; then
            echo -e "${GREEN}  ✓ Created task with ID: $TASK_ID${NC}"

            # Test 16: Update task status
            TOTAL=$((TOTAL + 1))
            echo -n "Testing: Update task status ... "

            UPDATE_TASK_RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BACKEND_URL/api/tasks/$TASK_ID" \
                -H "Authorization: Bearer $TOKEN" \
                -H "Content-Type: application/json" \
                -d "{\"status\":\"completed\"}" 2>&1)

            UPDATE_TASK_STATUS=$(echo "$UPDATE_TASK_RESPONSE" | tail -n1)

            if [ "$UPDATE_TASK_STATUS" = "200" ]; then
                echo -e "${GREEN}PASSED${NC} (HTTP $UPDATE_TASK_STATUS)"
                PASSED=$((PASSED + 1))
            else
                echo -e "${RED}FAILED${NC} (HTTP $UPDATE_TASK_STATUS)"
                FAILED=$((FAILED + 1))
            fi

            # Test 17: Delete task
            TOTAL=$((TOTAL + 1))
            echo -n "Testing: Delete task ... "

            DELETE_TASK_RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BACKEND_URL/api/tasks/$TASK_ID" \
                -H "Authorization: Bearer $TOKEN" 2>&1)

            DELETE_TASK_STATUS=$(echo "$DELETE_TASK_RESPONSE" | tail -n1)

            if [ "$DELETE_TASK_STATUS" = "200" ] || [ "$DELETE_TASK_STATUS" = "204" ]; then
                echo -e "${GREEN}PASSED${NC} (HTTP $DELETE_TASK_STATUS)"
                PASSED=$((PASSED + 1))
            else
                echo -e "${RED}FAILED${NC} (HTTP $DELETE_TASK_STATUS)"
                FAILED=$((FAILED + 1))
            fi
        fi
    else
        echo -e "${RED}FAILED${NC} (HTTP $CREATE_TASK_STATUS)"
        echo -e "${YELLOW}Response:${NC} $CREATE_TASK_BODY"
        FAILED=$((FAILED + 1))
    fi
fi

# Summary
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Verification Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed: $FAILED${NC}"
else
    echo -e "Failed: $FAILED"
fi
echo ""

# Calculate percentage
PERCENTAGE=$((PASSED * 100 / TOTAL))

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Deployment is successful!${NC}"
    exit 0
elif [ $PERCENTAGE -ge 80 ]; then
    echo -e "${YELLOW}⚠️  Most tests passed ($PERCENTAGE%), but some issues need attention.${NC}"
    exit 1
else
    echo -e "${RED}❌ Deployment verification failed. Please review errors above.${NC}"
    exit 1
fi
