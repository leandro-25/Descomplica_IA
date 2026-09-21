@echo off
echo Building Descomplica AI Clone...
echo.

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Build the project
echo Building project for production...
npm run build

echo.
echo Build completed! Files are in the 'dist' folder.
pause
