#!/bin/bash
# Start both backend and frontend servers

echo "========================================"
echo "AI Chat Todo Manager - Server Startup"
echo "========================================"
echo ""

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Check if ports are already in use
if check_port 8000; then
    echo "⚠️  Backend already running on port 8000"
    echo "   Kill it first with: lsof -ti:8000 | xargs kill -9"
    echo ""
fi

if check_port 3000; then
    echo "⚠️  Frontend already running on port 3000"
    echo "   Kill it first with: lsof -ti:3000 | xargs kill -9"
    echo ""
fi

echo "Starting Backend Server..."
echo "Location: backend/"
echo "Command: uvicorn src.main:app --reload --host 0.0.0.0 --port 8000"
echo ""

# Start backend in background
cd backend
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✓ Backend started (PID: $BACKEND_PID)"
cd ..

sleep 3

echo ""
echo "Starting Frontend Server..."
echo "Location: frontend/"
echo "Command: npm run dev"
echo ""

# Start frontend in background
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✓ Frontend started (PID: $FRONTEND_PID)"
cd ..

sleep 3

echo ""
echo "========================================"
echo "Servers Running!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Backend PID:  $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "View logs:"
echo "  Backend:  tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""
echo "Stop servers:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
