@echo off
echo ========================================
echo    SETUP APLIKASI KASIR MARTABAK
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [1/3] Installing dependencies...
    echo Please wait, this may take 2-5 minutes...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies!
        echo Make sure Node.js is installed.
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
    echo.
) else (
    echo [1/3] Dependencies already installed, skipping...
    echo.
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo [2/3] Setting up environment variables...
    echo.
    echo WARNING: .env.local file not found!
    echo.
    echo Please follow these steps:
    echo 1. Copy .env.example to .env.local
    echo 2. Fill in your Supabase credentials
    echo 3. Run this script again
    echo.
    echo Press any key to open setup guide...
    pause >nul
    start SETUP.md
    exit /b 1
) else (
    echo [2/3] Environment file found!
    echo.
)

echo [3/3] Starting development server...
echo.
echo ========================================
echo  Server will start at http://localhost:3000
echo  Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev
