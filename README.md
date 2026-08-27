# 🛡️ GeoShield - AI-Based Early Warning & Landslide Risk Monitoring System

**Smart India Hackathon 2026** | Problem Statement: SIH26001  
**Theme:** Disaster Management | **Organization:** MDoNER  
**Region:** North Eastern India (NER)

---

## 🎯 Problem Statement

The North Eastern Region (NER) frequently faces landslides, flash floods, road blockages, and slope failures due to heavy rainfall, fragile terrain, and unplanned hill cutting. There is limited use of real-time predictive systems for identifying high-risk zones and issuing early warnings.

## 💡 Our Solution

GeoShield is a comprehensive AI-powered early warning and monitoring platform that:

1. **Collects real-time data** from 20 IoT sensor stations across 8 NER states
2. **Uses AI/ML models** (Random Forest + Gradient Boosting ensemble) to predict landslide risk
3. **Provides GIS-based visualization** with interactive risk heatmaps
4. **Issues real-time alerts** to authorities and communities
5. **Enables citizen reporting** with geo-tagged photos and multilingual support
6. **Monitors road connectivity** and village risk zones

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GeoShield Platform                    │
├──────────────┬──────────────────┬────────────────────────┤
│   Frontend   │     Backend      │     AI Engine          │
│  React + TS  │    FastAPI       │  Random Forest +       │
│  Leaflet Map │    SQLite DB     │  Gradient Boosting     │
│  Recharts    │    WebSocket     │  Ensemble Model        │
│  TailwindCSS │    REST APIs     │  15 Feature Inputs     │
└──────────────┴──────────────────┴────────────────────────┘
```

## 🚀 Features

### Dashboard
- 📊 Real-time stats: 20 stations, risk distribution, road status
- 📈 Rainfall trends, risk trend charts (Recharts)
- 🗺️ State-wise risk summary

### GIS Risk Map
- 🌍 Interactive Leaflet map with dark theme
- 🔴 Risk heatmaps with color-coded markers
- 🛣️ Road status overlays (open/partially blocked/blocked)
- 🏘️ Village markers with population and risk zone

### Early Warning Alerts
- ⚠️ 4-level risk classification (Low/Moderate/High/Critical)
- 🔔 Acknowledge/Resolve workflow
- 📱 SMS/Push notification ready

### Citizen Reports
- 📝 Report types: cracks, slope movement, blocked roads, flooding
- 📸 Geo-tagged photo upload
- 🌐 Multilingual support (English, Hindi, Bengali, Assamese)

### AI Risk Engine
- 🤖 Ensemble ML model (RF + GB, soft voting)
- 📊 15 input features (rainfall, soil moisture, displacement, tilt, etc.)
- 🎯 Risk score 0-100 with landslide probability
- ⏰ Time window prediction and recommendations

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Maps | Leaflet + React-Leaflet |
| Charts | Recharts |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Backend | Python FastAPI |
| Database | SQLite + SQLAlchemy |
| ML/AI | scikit-learn (Random Forest + Gradient Boosting) |
| Real-time | WebSocket |

---

## 📦 Setup & Installation

### Prerequisites
- Python 3.12+
- Node.js 18+
- npm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/officialarghya29/geoshield.git
cd geoshield

# Setup Backend
cd backend
python3 -m pip install --break-system-packages -r requirements.txt
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
# Backend runs at http://localhost:8000

# Setup Frontend (in another terminal)
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

### Production Build

```bash
cd frontend
npm run build
# Frontend builds to frontend/dist/
# Backend auto-serves frontend from dist/
```

---

## 📊 Demo Data

The system comes pre-seeded with realistic data:
- **20 sensor stations** across all 8 NER states (Sikkim, Assam, Manipur, Mizoram, Meghalaya, Nagaland, Tripura, Arunachal Pradesh)
- **7 days of historical readings** (hourly) for each station
- **Weather data** (3-hour intervals)
- **8 major roads** with status monitoring
- **18 villages** with population and risk assessment
- **15 citizen reports**
- **5 active high-risk alerts**

---

## 🤖 AI Model Details

- **Model Type:** Ensemble (Random Forest + Gradient Boosting)
- **Training Samples:** 5,000 synthetic but realistic data points
- **Features:** 15 input features
- **Accuracy:** Train 100%, Test 76.5%
- **Risk Levels:** Low (<25), Moderate (25-50), High (50-75), Critical (>75)
- **Factors:** Rainfall, soil moisture, ground displacement, tilt, pore pressure, slope angle, vegetation cover

---

## 🌐 API Endpoints

| Endpoint | Description |
|----------|------------|
| `GET /api/health` | Health check |
| `GET /api/dashboard/stats` | Dashboard statistics |
| `GET /api/dashboard/risk-heatmap` | Risk heatmap data |
| `GET /api/dashboard/rainfall-trend` | Rainfall trend |
| `GET /api/dashboard/risk-trend` | Risk trend |
| `GET /api/sensors/stations` | All sensor stations |
| `GET /api/sensors/stations/{id}` | Station detail |
| `GET /api/alerts/active` | Active alerts |
| `GET /api/reports` | Citizen reports |
| `POST /api/reports` | Submit report |
| `GET /api/roads` | Road status |
| `GET /api/villages` | Village data |
| `GET /api/weather/{station}` | Weather data |
| `WS /ws/alerts` | WebSocket alerts |

---

## 🏆 Team

Built for SIH 2026 by **@officialarghya29**

---

## 📝 License

MIT License - Built for Smart India Hackathon 2026
