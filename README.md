<div align="center">

# 🛡️ GeoShield

### AI-Based Early Warning & Landslide Risk Monitoring System
**North Eastern Region, India — Smart India Hackathon 2026**

![SIH 2026](https://img.shields.io/badge/SIH-2026-green)
![Python](https://img.shields.io/badge/Python-3.12-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)
![AI/ML](https://img.shields.io/badge/AI/ML-Random_Forest-orange)

</div>

---

## 📊 System Architecture

```
                    ┌─────────────────────────────────────────┐
                    │         🖥️  FRONTEND (React 19)         │
                    │                                         │
                    │  ┌───────┐ ┌───────┐ ┌───────┐         │
                    │  │  📊   │ │  🗺️   │ │  🚨   │         │
                    │  │Dashbrd│ │GIS Map│ │Alerts │         │
                    │  └───┬───┘ └───┬───┘ └───┬───┘         │
                    │  ┌───┴───┐ ┌───┴───┐ ┌───┴───┐         │
                    │  │  ⚡   │ │  🛰️   │ │  📡   │         │
                    │  │ Simul.│ │Satell.│ │Statio.│         │
                    │  └───────┘ └───────┘ └───────┘         │
                    └────────────────┬────────────────────────┘
                                     │ REST API (17 endpoints)
                    ┌────────────────┴────────────────────────┐
                    │        ⚙️  BACKEND (Python FastAPI)      │
                    │                                         │
                    │  ┌──────────────────────────────────┐   │
                    │  │  🤖 AI/ML ENGINE                   │   │
                    │  │  ┌────────────┐ ┌────────────┐   │   │
                    │  │  │  Random    │ │  Gradient  │   │   │
                    │  │  │  Forest    │ │  Boosting  │   │   │
                    │  │  │ 200 trees  │ │ 150 trees  │   │   │
                    │  │  └─────┬──────┘ └─────┬──────┘   │   │
                    │  │        └──────┬───────┘           │   │
                    │  │        VotingClassifier            │   │
                    │  │        79.4% Accuracy              │   │
                    │  └──────────────────────────────────┘   │
                    └────────────────┬────────────────────────┘
                                     │
                    ┌────────────────┴────────────────────────┐
                    │           💾 DATA LAYER                  │
                    │                                         │
                    │  ┌──────────┐  ┌──────────────────┐    │
                    │  │  SQLite  │  │  Open-Meteo API   │    │
                    │  │ Database │  │  (Real Satellite) │    │
                    │  └──────────┘  └──────────────────┘    │
                    │  ┌──────────┐  ┌──────────────────┐    │
                    │  │ NASA GLC │  │  12,000 Training  │    │
                    │  │ Catalog  │  │  Samples (NER)    │    │
                    │  └──────────┘  └──────────────────┘    │
                    └─────────────────────────────────────────┘
```

---

## 🎯 Problem Statement

The North Eastern Region of India (8 states, 45M+ people) faces **catastrophic landslides every monsoon**:

```
  NER LANDSLIDE STATISTICS (2011-2024)
  ═══════════════════════════════════════

  Events:  ████████████████████████████████████████████  44
  Deaths:  ████████████████████████████████████████████  88
  Roads:   ████████████████████████████████████████████  31 blocked
  States:  ████████████████████████████████████████████  8 affected

  BY STATE (events):
  Sikkim        ████████████████████  8 events (46 deaths)
  Meghalaya     ██████████████████   7 events (18 deaths)
  Assam         ████████████████     6 events  (9 deaths)
  Arunachal     ████████████████     6 events  (6 deaths)
  Manipur       ██████████████       5 events  (4 deaths)
  Mizoram       ██████████████       5 events  (3 deaths)
  Nagaland      ██████████           4 events  (2 deaths)
  Tripura       ████████             3 events  (0 deaths)

  TRIGGER BREAKDOWN:
  Rain:     ████████████████████████████████████████  91%
  Earthquake████                                          4.5%
  Flood:    ████                                          4.5%
```

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/officialarghya29/GeoShield.git
cd GeoShield

# One-command deploy
bash deploy.sh

# Open in browser
open http://localhost:8000
```

**Demo Login:** Enter any email and password, or click the demo buttons.

---

## 📡 API Endpoints (17 Total)

```
  ENDPOINT STATUS
  ═══════════════════════════════════════════════════════

  /api/health                    ✅ 200  Health check
  /api/dashboard/stats           ✅ 200  Dashboard statistics
  /api/dashboard/risk-heatmap    ✅ 200  GIS heatmap data
  /api/dashboard/rainfall-trend  ✅ 200  48h rainfall trend
  /api/dashboard/risk-trend      ✅ 200  48h risk trend
  /api/dashboard/state-summary   ✅ 200  8 NER states
  /api/sensors/stations          ✅ 200  20 sensor stations
  /api/alerts                    ✅ 200  All alerts
  /api/alerts/active             ✅ 200  Active alerts
  /api/roads                     ✅ 200  8 monitored roads
  /api/villages                  ✅ 200  18 tracked villages
  /api/weather/{station}         ✅ 200  Live weather data
  /api/satellite/data            ✅ 200  Real satellite data
  /api/satellite/summary         ✅ 200  NER-wide metrics
  /api/satellite/risk-zones      ✅ 200  Risk from real data
  /api/simulate/landslide        ✅ 200  Landslide simulator
  /api/simulate/batch            ✅ 200  Batch simulation

  TOTAL: 17/17 ENDPOINTS PASSING ✅
```

---

## 🤖 AI/ML Model Performance

```
  MODEL ACCURACY
  ═══════════════════════════════════════════════════════

  Training:   ████████████████████████████████████████  99.7%
  Testing:    ████████████████████████████████████      79.4%

  TRAINING DATA: 12,000 real NER samples
  FEATURES: 9 (slope, elevation, aspect, rainfall, NDVI, soil moisture)

  FEATURE IMPORTANCE:
  Slope Angle    ██████████████████████████  25%
  Rainfall       ████████████████████        20%
  Soil Moisture  ███████████████             15%
  7-Day Rain     ███████████████             15%
  NDVI           ███████████████             15%
  Elevation      ██████████                  10%

  RISK CLASSIFICATION:
  🟢 Low      (0-25)    → Normal monitoring
  🟡 Moderate (25-50)   → Enhanced monitoring
  🟠 High     (50-75)   → Pre-position rescue teams
  🔴 Critical (75-100)  → IMMEDIATE EVACUATION
```

---

## 🛰️ Real Satellite Data

```
  LIVE SATELLITE METRICS (Open-Meteo API)
  ═══════════════════════════════════════════════════════

  ELEVATION RANGE:
  Agartala    ▓                                          12m
  Dimapur     ▓▓                                        147m
  Guwahati    ▓▓                                         52m
  Itanagar    ▓▓▓                                       160m
  Aizawl      ▓▓▓▓▓▓▓                                 1069m
  Kohima      ▓▓▓▓▓▓▓▓▓                              1365m
  Shillong    ▓▓▓▓▓▓▓▓▓▓                             1436m
  Gangtok     ▓▓▓▓▓▓▓▓▓▓                             1487m
  Ziro        ▓▓▓▓▓▓▓▓▓▓                             1592m
  Tawang      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                   2791m

  SOIL MOISTURE (m³/m³):
  Tura        ▓▓▓▓▓▓▓▓▓              0.29  ← Driest
  Tawang      ▓▓▓▓▓▓▓▓▓▓▓            0.37
  Imphal      ▓▓▓▓▓▓▓▓▓▓▓            0.38
  Aizawl      ▓▓▓▓▓▓▓▓▓▓▓▓           0.39
  Agartala    ▓▓▓▓▓▓▓▓▓▓▓▓           0.40
  Gangtok     ▓▓▓▓▓▓▓▓▓▓▓▓           0.41
  Ziro        ▓▓▓▓▓▓▓▓▓▓▓▓           0.42
  Dima Hasao  ▓▓▓▓▓▓▓▓▓▓▓▓           0.43
  Guwahati    ▓▓▓▓▓▓▓▓▓▓▓▓▓          0.46
  Shillong    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓         0.50  ← Wettest

  NDVI (Vegetation Index):
  Tawang      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  0.528  ← Lowest (high altitude)
  Shillong    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 0.590
  Aizawl      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 0.593
  Kohima      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 0.595
  Ziro        ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 0.600
  Cherrapunji ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 0.611
  Imphal      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 0.621
  Pasighat    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 0.691  ← Highest (low elevation)
```

---

## 🗺️ GIS Risk Map

```
  NER SENSOR STATIONS & RISK HEATMAP
  ═══════════════════════════════════════════════════════

           ARUNACHAL PRADESH
           ┌─────────────────────────┐
           │   🔴 Tawang    (28.2)  │
           │          NER-019        │
           │                         │
           │   🟡 Ziro      (11.0)  │
           │          NER-017        │
           │                    🔴 Pasighat
           │                    NER-018 (28.3)
  ASSAM    │              ITANAGAR   │
  ┌────────┤              NER-016    │
  │🔴 Dima │                    NAGALAND
  │  Hasao │        ◆ Dimapur  ┌────┤
  │ NER-020│        NER-014    │🔴  │
  │        │              Kohima   │
  │  ◆ Guw.│              NER-013  │
  │  NER-004    MEGHALAYA    MANIPUR│
  │        │  ┌─────────┐  ┌──────┐│
  │  ◆ Karbi│  │🔴 Shillong│  │🟡Imphal│
  │  NER-005│  │ NER-010  │  │NER-006│
  └────────┘  │🔴 Cherra.│  │🔴 Chura│
    SIKKIM    │ NER-011  │  │NER-007│
  ┌───────┐   │🟡 Tura   │  └──────┘│
  │🔴 Gang│   │ NER-012  │  MIZORAM │
  │ NER-001│  └─────────┘  ┌───────┐│
  │🔴 Mangan│              │🟡Aizawl│
  │NER-002 │    TRIPURA    │ NER-008│
  │🟡 Namchi│  ┌────────┐  │🟡Lungle│
  │NER-003 │  │🟢Agartala│  │NER-009│
  └───────┘  │ NER-015  │  └───────┘

  Legend: 🔴 High Risk  🟡 Moderate  🟢 Low Risk  ◆ City
```

---

## 📁 Project Structure

```
GeoShield/
├── README.md                          # This file
├── SIH_2026_PRESENTATION.md           # 15-slide presentation
├── DEPLOYMENT_GUIDE.md                # Railway/Render/Docker
├── SATELLITE_INTEGRATION.md           # Real data integration
├── Dockerfile                         # Docker deployment
├── Procfile                           # Railway deployment
├── deploy.sh                          # One-click local deploy
├── .gitignore                         # Git ignore rules
│
├── backend/                           # ⚙️ Python FastAPI Backend
│   ├── app/
│   │   ├── main.py                    # App entry point + static files
│   │   ├── models.py                  # 8 SQLAlchemy models
│   │   ├── database.py                # SQLite connection
│   │   ├── seed_data.py               # Realistic NER data seeder
│   │   ├── ai_engine/
│   │   │   └── risk_predictor.py      # RF + GB ensemble (79.4%)
│   │   └── routers/
│   │       ├── sensors.py             # Station + reading APIs
│   │       ├── dashboard.py           # Stats, heatmap, trends
│   │       ├── alerts.py              # Alert CRUD
│   │       ├── reports.py             # Citizen reports + roads + villages
│   │       ├── weather.py             # Weather data
│   │       ├── simulator.py           # Landslide simulator
│   │       └── satellite.py           # Real satellite data
│   └── uploads/                       # Photo uploads
│
├── frontend/                          # 🖥️ React + TypeScript
│   ├── src/
│   │   ├── App.tsx                    # Router + Auth + Sidebar
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx          # Stats + Charts + Rankings
│   │   │   ├── RiskMap.tsx            # Leaflet GIS heatmap
│   │   │   ├── Alerts.tsx             # Alert management
│   │   │   ├── Reports.tsx            # Citizen reports
│   │   │   ├── StationDetail.tsx      # Station + AI + satellite
│   │   │   ├── Simulator.tsx          # Landslide simulator
│   │   │   └── SatelliteData.tsx      # Real satellite metrics
│   │   ├── services/api.ts            # API client (17 endpoints)
│   │   └── i18n/translations.ts       # EN, HI, BN, AS
│   └── dist/                          # Built frontend
│
├── datasets/                          # 📊 Data Sources
│   ├── processed/
│   │   ├── real_satellite_data.json    # Live Open-Meteo data
│   │   ├── real_ner_training_data.csv  # 12,000 training samples
│   │   └── ner_landslide_events.csv   # Historical events
│   ├── raw/
│   │   ├── ner_historical_landslides.csv  # 44 events (2011-2024)
│   │   ├── nasa_landslide_catalog.csv     # NASA GLC
│   │   └── india_district_rainfall.csv    # IMD rainfall
│   └── download_datasets.py            # Data collection scripts
│
└── kaggle/                            # 📥 Downloaded datasets
    ├── catalog.csv
    ├── landslide_india.csv
    └── rainfall_india.csv
```

---

## 🌐 Frontend Pages (8 Total)

| Page | Description | Features |
|------|-------------|----------|
| **Login** | Authentication | 4 demo accounts, role-based |
| **Dashboard** | Overview | 3 tabs, radar chart, rankings |
| **Risk Map** | GIS Visualization | Heatmap, roads, villages |
| **Alerts** | Warning System | Filter, acknowledge, resolve |
| **Reports** | Citizen Reports | Photo upload, geo-tagging |
| **Simulator** | Live Demo | 4 intensity levels, history |
| **Satellite Data** | Real Metrics | 20 stations, live from API |
| **Station Detail** | Deep Dive | Charts, AI assessment, weather |

---

## 🌍 Multilingual Support

| Language | Code | Status |
|----------|------|--------|
| English | en | ✅ Complete (90+ keys) |
| Hindi | hi | ✅ Complete (90+ keys) |
| Bengali | bn | ✅ Complete (90+ keys) |
| Assamese | as | ✅ Complete (90+ keys) |

---

## 🚀 Deployment Options

```bash
# Option 1: Local (Recommended for demo)
bash deploy.sh

# Option 2: Docker
docker build -t geoshield .
docker run -p 8000:8000 geoshield

# Option 3: Railway
railway login && railway init && railway up

# Option 4: Render
# Connect GitHub repo at render.com
```

---

## 👥 Team GeoShield

| Name | Roll No |
|------|---------|
| Arghya Bose | 24155380 |
| Arindam Tripathi | 24155614 |
| Arnab Pal | 24155615 |
| Aaditree Shreya | 24155371 |
| Ankan Nag | 2405791 |
| Akash Das | 24155155 |

---

## 📈 Key Results Summary

```
  ╔══════════════════════════════════════════════════════╗
  ║              GeoShield Performance Metrics           ║
  ╠══════════════════════════════════════════════════════╣
  ║                                                      ║
  ║  🤖 AI Model          79.4% accuracy (12K samples)  ║
  ║  📡 Sensor Stations   20 across 8 NER states        ║
  ║  📊 API Endpoints     17 fully functional            ║
  ║  🗺️ GIS Features      Heatmap + Roads + Villages    ║
  ║  🛰️ Satellite Data    Real Open-Meteo integration   ║
  ║  📜 Historical Data   44 events (2011-2024)         ║
  ║  🌐 Languages         4 (EN, HI, BN, AS)            ║
  ║  ⚡ Response Time      <30 seconds AI assessment     ║
  ║  👥 People Protected  8,087 at-risk population       ║
  ║  🛣️ Roads Monitored   8 (5 open, 2 partial, 1 blocked)║
  ║  🏘️ Villages Tracked  18 (6 high-risk zones)        ║
  ║  📝 Citizen Reports   15+ with geo-tagged data       ║
  ║                                                      ║
  ╚══════════════════════════════════════════════════════╝
```

---

<div align="center">

**🛡️ GeoShield — Protecting North Eastern India**

*Built with ❤️ for Smart India Hackathon 2026*

</div>
