#!/bin/bash
# ═══════════════════════════════════════════════════════════
#  GeoShield Demo Startup Script
#  AI-Based Landslide Risk Monitoring System
#  Smart India Hackathon 2026
# ═══════════════════════════════════════════════════════════

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║   🛡️  GeoShield - AI Landslide Monitoring System            ║"
echo "║   Smart India Hackathon 2026 | Problem ID: 26001            ║"
echo "║   Ministry of Development of North Eastern Region            ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3 not found. Please install Python 3.10+${NC}"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node 18+${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python: $(python3 --version)${NC}"
echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"

# Kill existing servers
echo -e "${YELLOW}🔄 Stopping existing servers...${NC}"
pkill -f "uvicorn app.main" 2>/dev/null || true
sleep 1

# Build frontend if needed
if [ ! -d "frontend/dist" ]; then
    echo -e "${YELLOW}📦 Building frontend...${NC}"
    cd frontend
    npm install --silent
    npm run build --silent
    cd ..
fi

# Start backend
echo -e "${GREEN}🚀 Starting GeoShield backend...${NC}"
cd backend
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait for server
echo -e "${YELLOW}⏳ Waiting for server to start...${NC}"
sleep 6

# Health check
HEALTH=$(curl -s http://localhost:8000/api/health 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin)['status'])" 2>/dev/null || echo "failed")
if [ "$HEALTH" = "healthy" ]; then
    echo -e "${GREEN}✅ Server is healthy!${NC}"
else
    echo -e "${RED}❌ Server failed to start. Check logs.${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  🌐 Open: http://localhost:8000${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}  LOGIN CREDENTIALS:${NC}"
echo "  ┌─────────────────────────────────────────────────────────┐"
echo "  │ Role         │ Email                        │ Password  │"
echo "  ├─────────────────────────────────────────────────────────┤"
echo "  │ Admin        │ admin@geoshield.gov.in       │ admin123  │"
echo "  │ Field Officer│ field@geoshield.gov.in       │ field123  │"
echo "  │ District Admin│ district@geoshield.gov.in  │ district123│"
echo "  │ Citizen      │ citizen@geoshield.gov.in     │ demo123   │"
echo "  └─────────────────────────────────────────────────────────┘"
echo ""
echo -e "${YELLOW}  DEMO FLOW (3 minutes):${NC}"
echo "  1️⃣  Login → Dashboard Overview (20 stations, risk charts)"
echo "  2️⃣  Risk Map → Interactive GIS heatmap with click-to-predict"
echo "  3️⃣  Simulator → Trigger CRITICAL landslide → Watch alert fire"
echo "  4️⃣  Alerts → See generated alert with affected population"
echo "  5️⃣  Satellite Data → Real Open-Meteo metrics for all stations"
echo "  6️⃣  Station Detail → Sensor charts + AI risk assessment"
echo "  7️⃣  Language → Switch Hindi/Bengali/Assamese"
echo "  8️⃣  Export → Download GeoJSON/CSV from Risk Map"
echo ""
echo -e "${RED}  Press Ctrl+C to stop the server${NC}"
echo ""

# Wait for Ctrl+C
trap "echo -e '\n${YELLOW}Stopping server...${NC}'; kill $BACKEND_PID 2>/dev/null; echo -e '${GREEN}✅ Stopped.${NC}'; exit 0" SIGINT SIGTERM

wait $BACKEND_PID
