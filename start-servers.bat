@echo off
REM Start both backend and frontend servers

echo ========================================
echo AI Chat Todo Manager - Server Startup
echo ========================================
echo.

REM Check if already running
netstat -ano | findstr :8000 >nul
if %errorlevel%==0 (
    echo Backend already running on port 8000
    echo Kill it first with: taskkill /F /IM python.exe
    echo.
)

netstat -ano | findstr :3000 >nul
if %errorlevel%==0 (
    echo Frontend already running on port 3000
    echo Kill it first with: taskkill /F /IM node.exe
    echo.
)

echo Starting Backend Server...
echo Location: backend/
echo Command: uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
echo.
start "Backend Server" cmd /k "cd backend && uvicorn src.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
echo Location: frontend/
echo Command: npm run dev
echo.
start "Frontend Server" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo Servers Starting!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Check the new terminal windows for server output.
echo Press Ctrl+C in each window to stop servers.
echo.
pause
