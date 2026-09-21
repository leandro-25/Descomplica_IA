@echo off
echo Starting Descomplica AI Clone...
echo.

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Start the development server
echo Starting development server...
npm run dev

pause
