#!/bin/bash

# HackMatrix Quick Start Script for macOS/Linux

echo ""
echo "========================================"
echo "  HackMatrix Setup & Run"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found! Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python not found! Please install Python 3.9+ from https://www.python.org/"
    exit 1
fi

echo "✅ Node.js and Python found"
echo ""

# Start Backend
echo "Starting HackMatrix Backend..."
cd hackmatrix-backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements
echo "Installing Python dependencies..."
pip install -q -r requirements.txt

# Start backend in background
echo "Launching Backend on http://localhost:8000"
python main.py &
BACKEND_PID=$!

sleep 3

cd ..

# Start Frontend
echo "Starting HackMatrix Frontend..."
cd frontend_lovable

# Install npm dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

# Start frontend
echo "Launching Frontend on http://localhost:5173"
npm run dev &
FRONTEND_PID=$!

# Handle cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

echo ""
echo "✅ Both services started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔌 Backend: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both services..."
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
