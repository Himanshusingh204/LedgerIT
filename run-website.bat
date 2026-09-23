@echo off
setlocal enabledelayedexpansion

title LedgerIT - Web Application
color 0B

echo =====================================================================
echo                     LedgerIT - Launch Website
echo =====================================================================
echo.

:: 1. Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your PATH.
    echo Please install Node.js 20+ from https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: 2. Target URL
set "APP_URL=http://localhost:3000"

:: 3. Launch browser after a 3-second delay to allow Turbopack to bind port 3000
echo [*] Opening browser to %APP_URL% in 3 seconds...
start "" /b powershell -NoProfile -Command "Start-Sleep -Seconds 3; Start-Process '%APP_URL%'"

:: 4. Start Next.js Development Server
echo [*] Starting Next.js development server with Turbopack...
echo [*] Press Ctrl+C in this window anytime to stop the server.
echo.
echo ---------------------------------------------------------------------

if "%1"=="prod" (
    echo [*] Running Production Mode (build + start)...
    call npm run build && call npm start
) else (
    call npm run dev
)

exit /b %errorlevel%
