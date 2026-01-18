Write-Host "========================================" -ForegroundColor Cyan
Write-Host " CrediLens Setup & Run" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

# Check Node
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Node.js not found! Please install Node.js v18+"
    exit 1
}

# Check Python
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Python not found! Please install Python 3.9+"
    exit 1
}

Write-Host "✅ Dependencies found. Starting App..." -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "🚀 Launching Backend (FastAPI)..." -ForegroundColor Yellow
Start-Process -FilePath "python" -ArgumentList "main.py" -WorkingDirectory "hackmatrix-backend" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "🚀 Launching Frontend (Vite)..." -ForegroundColor Yellow
if (-not (Test-Path "frontend_lovable\node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Gray
    Push-Location "frontend_lovable"
    npm install
    Pop-Location
}

Start-Process -FilePath "cmd" -ArgumentList "/k cd frontend_lovable && npm run dev" -WorkingDirectory "." -WindowStyle Normal

Write-Host ""
Write-Host "✅ App launched!" -ForegroundColor Green
Write-Host "👉 Frontend: http://localhost:8080"
Write-Host "👉 Backend:  http://localhost:8000/docs"
Write-Host ""
Read-Host "Press Enter to exit this launcher (terminals will stay open)..."
