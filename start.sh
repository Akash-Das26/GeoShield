#!/bin/bash
# ═══════════════════════════════════════════════════════════
#  GeoShield - One-Command Launcher
#  Usage: ./start.sh [--docker] [--seed] [--train] [--stop]
# ═══════════════════════════════════════════════════════════

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ACTION="${1:-start}"

case "$ACTION" in
    --stop)
        echo -e "${YELLOW}Stopping all GeoShield services...${NC}"
        pkill -f "uvicorn app.main" 2>/dev/null || true
        pkill -f "vite" 2>/dev/null || true
        echo -e "${GREEN}✅ All services stopped.${NC}"
        exit 0
        ;;
    --docker)
        echo -e "${YELLOW}Starting with Docker Compose...${NC}"
        docker-compose up --build -d
        echo -e "${GREEN}✅ Docker services started.${NC}"
        echo "  Backend: http://localhost:8000"
        exit 0
        ;;
    --seed)
        echo -e "${YELLOW}Seeding database...${NC}"
        cd backend
        python3 -c "from app.seed_data import seed_database; seed_database()"
        echo -e "${GREEN}✅ Database seeded.${NC}"
        exit 0
        ;;
    --train)
        echo -e "${YELLOW}Retraining ML model...${NC}"
        cd backend
        rm -f app/ai_engine/models/geoshield_model.pkl
        python3 -c "from app.ai_engine.risk_predictor import get_predictor; get_predictor()"
        echo -e "${GREEN}✅ Model retrained.${NC}"
        exit 0
        ;;
    --status)
        echo -e "${YELLOW}GeoShield Service Status:${NC}"
        if pgrep -f "uvicorn app.main" > /dev/null; then
            echo -e "  Backend: ${GREEN}RUNNING${NC} (port 8000)"
        else
            echo -e "  Backend: ${RED}STOPPED${NC}"
        fi
        if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
            echo -e "  Health:  ${GREEN}HEALTHY${NC}"
        else
            echo -e "  Health:  ${RED}UNREACHABLE${NC}"
        fi
        exit 0
        ;;
    *)
        echo -e "${GREEN}🛡️  Starting GeoShield...${NC}"
        exec "$SCRIPT_DIR/demo.sh"
        ;;
esac
