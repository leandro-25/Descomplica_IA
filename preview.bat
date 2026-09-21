@echo off
echo Previewing Descomplica AI Clone...
echo.

REM Check if dist folder exists
if not exist "dist" (
    echo Error: Build not found. Please run build.bat first.
    pause
    exit /b 1
)

REM Start preview server
echo Starting preview server...
npm run preview

pause
