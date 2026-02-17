@echo off
REM Test Todo App Deployment - Windows Version
REM Run this after completing deployment to verify everything works

echo ================================================================
echo  Testing Todo App Deployment
echo ================================================================
echo.

set BACKEND_URL=https://sheeba0321-hackathon-2-phase-2.hf.space

echo Testing Backend...
echo URL: %BACKEND_URL%
echo.

echo 1. Health Check:
curl -s "%BACKEND_URL%/health"
echo.
echo.

echo 2. API Docs (should return 200):
curl -s -o nul -w "Status: %%{http_code}" "%BACKEND_URL%/docs"
echo.
echo.

echo 3. Register Endpoint Test:
curl -s -o nul -w "Status: %%{http_code}" -X POST "%BACKEND_URL%/auth/register" -H "Content-Type: application/json" -d "{}"
echo.
echo.

echo 4. Login Endpoint Test:
curl -s -o nul -w "Status: %%{http_code}" -X POST "%BACKEND_URL%/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"test\"}"
echo.
echo.

echo ================================================================
echo  Summary
echo ================================================================
echo.
echo Check the health endpoint response above.
echo If "database":"connected" - Backend is ready!
echo If "database":"disconnected" - Fix DATABASE_URL in HF Spaces
echo.
echo Next steps:
echo 1. Deploy frontend to Vercel (see DEPLOY_NOW.md)
echo 2. Test from browser
echo.
echo Backend Docs: %BACKEND_URL%/docs
echo Full Guide: DEPLOY_NOW.md
echo.
pause
