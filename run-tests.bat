@echo off
setlocal enabledelayedexpansion

title LedgerIT - Enterprise Test Suite Runner
color 0F

:: Auto-detect non-interactive mode
set NO_PAUSE=0
if defined CI set NO_PAUSE=1
if "%1"=="--no-pause" (
    set NO_PAUSE=1
    shift
)
if "%2"=="--no-pause" set NO_PAUSE=1

echo =====================================================================
echo                   LedgerIT Test Suite Runner
echo =====================================================================
echo.

:: 1. Verify Node.js presence
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your PATH.
    echo Please install Node.js 20+ from https://nodejs.org
    goto :FAIL
)

:: 2. Target dispatching
if "%1"=="unit" goto :RUN_UNIT
if "%1"=="lint" goto :RUN_LINT
if "%1"=="typecheck" goto :RUN_TYPECHECK
if "%1"=="build" goto :RUN_BUILD
if "%1"=="watch" goto :RUN_WATCH

:RUN_ALL
echo [1/4] Running TypeScript Typecheck (npx tsc --noEmit)...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo.
    echo [FAIL] TypeScript typecheck failed!
    goto :FAIL
)
echo [PASS] TypeScript typecheck completed with 0 errors.
echo.

echo [2/4] Running ESLint Code Quality Audit (npm run lint)...
call npm run lint
if %errorlevel% neq 0 (
    echo.
    echo [FAIL] ESLint audit failed!
    goto :FAIL
)
echo [PASS] ESLint check completed with 0 errors.
echo.

echo [3/4] Running Vitest Unit and Integration Tests (npm test)...
call npm test
if %errorlevel% neq 0 (
    echo.
    echo [FAIL] Vitest tests failed!
    goto :FAIL
)
echo [PASS] All Vitest test suites passed.
echo.

echo [4/4] Verifying Next.js Turbopack Production Build (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [FAIL] Production build failed!
    goto :FAIL
)
echo [PASS] Next.js production build compiled cleanly.
echo.

:SUCCESS
echo =====================================================================
echo   [SUCCESS] All tests, audits, and builds passed with 100%% integrity!
echo =====================================================================
echo.
if "!NO_PAUSE!"=="0" pause
exit /b 0

:RUN_UNIT
echo [*] Running Vitest Unit Tests Only...
call npm run test:unit
if %errorlevel% neq 0 goto :FAIL
echo [PASS] Unit tests completed successfully.
if "!NO_PAUSE!"=="0" pause
exit /b 0

:RUN_LINT
echo [*] Running ESLint Check Only...
call npm run lint
if %errorlevel% neq 0 goto :FAIL
echo [PASS] ESLint check completed with 0 errors.
if "!NO_PAUSE!"=="0" pause
exit /b 0

:RUN_TYPECHECK
echo [*] Running TypeScript Check Only...
call npx tsc --noEmit
if %errorlevel% neq 0 goto :FAIL
echo [PASS] TypeScript check completed with 0 errors.
if "!NO_PAUSE!"=="0" pause
exit /b 0

:RUN_BUILD
echo [*] Running Production Build Only...
call npm run build
if %errorlevel% neq 0 goto :FAIL
echo [PASS] Production build succeeded.
if "!NO_PAUSE!"=="0" pause
exit /b 0

:RUN_WATCH
echo [*] Launching Vitest Interactive Watch Mode...
call npm run test:watch
exit /b %errorlevel%

:FAIL
echo.
echo =====================================================================
echo   [FAIL] Test suite failed! Please review the error messages above.
echo =====================================================================
echo.
if "!NO_PAUSE!"=="0" pause
exit /b 1
