#!/bin/bash
# Quick Setup Verification Script

echo "========================================="
echo "AI Chat Todo Manager - Setup Verification"
echo "========================================="
echo ""

# Check Python
echo "1. Checking Python..."
if command -v python &> /dev/null; then
    python --version
    echo "   ✓ Python found"
else
    echo "   ✗ Python not found"
    exit 1
fi

# Check Node.js
echo ""
echo "2. Checking Node.js..."
if command -v node &> /dev/null; then
    node --version
    echo "   ✓ Node.js found"
else
    echo "   ✗ Node.js not found"
    exit 1
fi

# Check backend dependencies
echo ""
echo "3. Checking backend dependencies..."
cd backend
if python -c "import fastapi, openai, sqlmodel" 2>/dev/null; then
    echo "   ✓ Backend dependencies installed"
else
    echo "   ✗ Backend dependencies missing"
    echo "   Run: pip install -r requirements.txt"
fi

# Check environment variables
echo ""
echo "4. Checking backend environment..."
if [ -f ".env" ]; then
    echo "   ✓ .env file exists"

    if grep -q "DATABASE_URL" .env; then
        echo "   ✓ DATABASE_URL set"
    else
        echo "   ✗ DATABASE_URL missing"
    fi

    if grep -q "OPENAI_API_KEY" .env; then
        echo "   ✓ OPENAI_API_KEY set"
    else
        echo "   ✗ OPENAI_API_KEY missing"
    fi

    if grep -q "BETTER_AUTH_SECRET" .env; then
        echo "   ✓ BETTER_AUTH_SECRET set"
    else
        echo "   ✗ BETTER_AUTH_SECRET missing"
    fi
else
    echo "   ✗ .env file not found"
    echo "   Copy .env.example to .env and configure"
fi

# Check database connection
echo ""
echo "5. Testing database connection..."
if python -c "
import os
from dotenv import load_dotenv
load_dotenv()
import psycopg2
conn = psycopg2.connect(os.getenv('DATABASE_URL'))
conn.close()
" 2>/dev/null; then
    echo "   ✓ Database connection successful"
else
    echo "   ✗ Database connection failed"
fi

# Check frontend
echo ""
echo "6. Checking frontend..."
cd ../frontend
if [ -d "node_modules" ]; then
    echo "   ✓ Frontend dependencies installed"
else
    echo "   ✗ Frontend dependencies missing"
    echo "   Run: npm install"
fi

if [ -f ".env.local" ]; then
    echo "   ✓ .env.local exists"
else
    echo "   ⚠ .env.local not found (optional)"
fi

# Summary
echo ""
echo "========================================="
echo "Setup Verification Complete!"
echo "========================================="
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  uvicorn src.main:app --reload"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
