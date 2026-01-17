@echo off
REM HackMatrix Quick Start Script for Windows

echo.
echo ========================================
echo  HackMatrix Setup & Run
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js v18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found! Please install Python 3.9+ from https://www.python.org/
    pause
    exit /b 1
)

echo ✅ Node.js and Python found
echo.

REM Start Backend
echo Starting HackMatrix Backend...
cd hackmatrix-backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install requirements
echo Installing Python dependencies...
pip install -q -r requirements.txt

REM Start backend in new window
echo Launching Backend on http://localhost:8000
start "HackMatrix Backend" cmd /k "python main.py"

timeout /t 3 /nobreak

cd ..

REM Start Frontend
echo Starting HackMatrix Frontend...
cd frontend_lovable

REM Install npm dependencies
if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
)

REM Start frontend
echo Launching Frontend on http://localhost:5173
call npm run dev

pause
