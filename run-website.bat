@echo off
setlocal enabledelayedexpansion

title LedgerIT - Web Application
color 0B

echo =====================================================================
echo                     LedgerIT - Launch Website
echo =====================================================================
echo.

:: 1. Verify Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your PATH.
    echo Please install Node.js 20+ from https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: 2. Port Selection (Default to 3005 to avoid collision with other websites running on 3000)
set "PORT=3005"
if not "%~1"=="" (
    if not "%~1"=="prod" (
        set "PORT=%~1"
    )
)

:: 3. Check if chosen port is in use, and auto-increment if occupied
:CHECK_PORT
netstat -ano | findstr ":%PORT% " | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo [!] Port %PORT% is currently occupied by another website/process.
    set /a PORT+=1
    echo [*] Checking next available port: !PORT!...
    goto :CHECK_PORT
)

:: 4. Set Environment Variables for this session
set "PORT=!PORT!"
set "NEXT_PUBLIC_APP_URL=http://localhost:!PORT!"
set "APP_URL=http://localhost:!PORT!"

echo.
echo [*] Dedicated Port : !PORT! (Isolated from other websites)
echo [*] Web Address    : !APP_URL!
echo [*] Opening browser to !APP_URL! in 3 seconds...
echo.

:: 5. Launch browser after 3-second delay
start "" /b powershell -NoProfile -Command "Start-Sleep -Seconds 3; Start-Process '!APP_URL!'"

:: 6. Launch Server
echo [*] Starting Next.js server with Turbopack on port !PORT!...
echo [*] Press Ctrl+C in this terminal anytime to stop the server.
echo ---------------------------------------------------------------------
echo.

if "%1"=="prod" (
    echo [*] Running Production Mode (build + start on port !PORT!)...
    call npm run build && call npm start -- -p !PORT!
) else if "%2"=="prod" (
    echo [*] Running Production Mode (build + start on port !PORT!)...
    call npm run build && call npm start -- -p !PORT!
) else (
    call npm run dev -- -p !PORT!
)

exit /b %errorlevel%
