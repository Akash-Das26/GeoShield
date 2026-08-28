@echo off
title GeoShield - AI Landslide Monitoring
echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║  GeoShield - AI Landslide Monitoring         ║
echo  ║  Smart India Hackathon 2026                  ║
echo  ╚══════════════════════════════════════════════╝
echo.
echo Starting backend server...

cd /d "%~dp0backend"

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.10+
    echo Download: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

REM Seed database if needed
if not exist "geoshield.db" (
    echo Seeding database with NER landslide data...
    python -m app.seed_data
    python -m app.seed_risk_history
)

REM Start server
echo Starting API server on http://localhost:8000...
start /B python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

REM Wait for server
timeout /t 3 /nobreak >nul

echo.
echo Opening GeoShield in your browser...
start http://localhost:8000

echo.
echo ┌──────────────────────────────────────────────┐
echo │  GeoShield is running!                       │
echo │  URL: http://localhost:8000                  │
echo │  Login: admin@geoshield.gov.in / admin123   │
echo │  Press Ctrl+C to stop                        │
echo └──────────────────────────────────────────────┘
echo.

REM Keep running
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
