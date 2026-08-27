#!/bin/bash
# GeoShield Deployment Script
# Quick setup and run

echo "🛡️ GeoShield - Deploying..."
echo "================================"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python 3.10+"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Python: $(python3 --version)"
echo "✅ Node.js: $(node --version)"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
python3 -m pip install -r requirements.txt --quiet 2>/dev/null || pip install -r requirements.txt --quiet 2>/dev/null
cd ..

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install --silent 2>/dev/null
npx vite build --silent 2>/dev/null
cd ..

echo ""
echo "🚀 Starting GeoShield on port 8000..."
echo "   Open http://localhost:8000 in your browser"
echo ""

# Start the server
cd backend
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
