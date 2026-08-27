# 🛡️ GeoShield — AI-Based Early Warning & Landslide Risk Monitoring System

<p align="center">
  <img src="frontend/public/favicon.svg" width="100" alt="GeoShield Logo">
</p>

<p align="center">
  <strong>Smart India Hackathon 2026</strong> | Problem Statement: <strong>SIH26001</strong><br>
  Theme: <strong>Disaster Management</strong> | Organization: <strong>Ministry of Development of North Eastern Region (MDoNER)</strong>
</p>

---

## 🏆 Team GeoShield

| Name | Roll No |
|------|--------|
| Arghya Bose | 24155380 |
| Arindam Tripathi | 24155614 |
| Arnab Pal | 24155615 |
| Aaditree Shreya | 24155371 |
| Ankan Nag | 2405791 |
| Akash Das | 24155155 |

---

## 🎯 Problem Statement

> The North Eastern Region (NER) frequently faces landslides, flash floods, road blockages, and slope failures due to heavy rainfall, fragile terrain, and unplanned hill cutting. Currently, monitoring is mostly reactive and dependent on manual reporting. There is limited use of real-time predictive systems for identifying high-risk zones and issuing early warnings.

---

## 💡 Our Solution

**GeoShield** is a comprehensive AI-powered early warning and monitoring platform that predicts landslide risks in real-time across all 8 NER states using sensor data, satellite imagery, and machine learning.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        GeoShield Platform                         │
├────────────────┬────────────────────┬────────────────────────────┤
│                │                    │                            │
│   🖥️ Frontend   │   ⚙️ Backend API    │   🤖 AI/ML Engine          │
│   React 18     │   FastAPI          │   Random Forest +          │
│   TypeScript   │   Python 3.12      │   Gradient Boosting        │
│   Leaflet GIS  │   SQLite + ORM     │   Ensemble Model           │
│   Recharts     │   WebSocket        │   15 Feature Inputs        │
│   TailwindCSS  │   REST APIs        │   Risk Score 0-100         │
│                │                    │                            │
├────────────────┴────────────────────┴────────────────────────────┤
│                        📡 Data Sources                            │
│  🌧️ Rainfall | 💧 Soil Moisture | 🛰️ Satellite NDVI | 🏔️ DEM     │
│  📊 Historical Landslides | ☁️ Weather API | 📱 Citizen Reports   │
└──────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 📊 Real-Time Dashboard
- Live sensor network status (20 stations across 8 states)
- Risk distribution pie chart with animated visualization
- 48-hour rainfall and risk trend charts
- Road connectivity status (open / partially blocked / blocked)
- State-wise risk overview

### 🗺️ Interactive GIS Risk Map
- Leaflet-powered dark-themed map of NER
- Risk heatmap with color-coded markers (Green → Red)
- Road status overlays with blockage indicators
- Village markers with population and risk zone data
- Click any station for detailed sensor readings

### 🚨 Early Warning System
- 4-level risk classification: Low → Moderate → High → Critical
- Acknowledge/Resolve alert workflow
- WebSocket-based real-time alert broadcasting
- Affected population tracking per alert

### 📝 Citizen Reporting Portal
- Report types: Cracks, Slope Movement, Blocked Roads, Flooding
- Geo-tagged photo upload
- Multilingual support: English, Hindi, Bengali, Assamese

### 🤖 AI Risk Prediction Engine
- **Model:** Ensemble (Random Forest + Gradient Boosting)
- **Training:** 5,000 samples, 15 input features
- **Test Accuracy:** 76.5%
- **Risk Score:** 0-100 with landslide probability
- **Time Window:** Predicted event window per assessment

### 🛰️ Sensor Network
- **20 stations** across Sikkim, Assam, Manipur, Mizoram, Meghalaya, Nagaland, Tripura, Arunachal Pradesh
- **7 days** of historical hourly readings (3,360 data points per station)
- **15 features:** Rainfall, soil moisture, temperature, ground displacement, tilt (X/Y), pore water pressure, vibration, slope angle, elevation, vegetation cover, cumulative rainfall

---

## 📁 Project Structure

```
GeoShield/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── models.py            # SQLAlchemy database models
│   │   ├── database.py          # SQLite configuration
│   │   ├── seed_data.py         # NER region demo data generator
│   │   ├── seed_risk_history.py # Historical risk assessment generator
│   │   ├── ai_engine/
│   │   │   └── risk_predictor.py # ML risk prediction model
│   │   ├── routers/
│   │   │   ├── sensors.py       # Sensor station endpoints
│   │   │   ├── dashboard.py     # Dashboard statistics
│   │   │   ├── alerts.py        # Alert management
│   │   │   ├── reports.py       # Citizen reports & road/village data
│   │   │   └── weather.py       # Weather data
│   │   └── services/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main app with routing
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx    # Main dashboard
│   │   │   ├── RiskMap.tsx      # GIS risk map
│   │   │   ├── Alerts.tsx       # Alert management
│   │   │   ├── Reports.tsx      # Citizen reports
│   │   │   └── StationDetail.tsx # Station detail view
│   │   ├── services/api.ts      # API client
│   │   └── i18n/translations.ts # Multilingual support
│   └── package.json
├── datasets/
│   ├── README.md                # Data sources & download guide
│   └── download_datasets.py     # Dataset generator
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### 1. Clone & Setup Backend
```bash
git clone https://github.com/officialarghya29/GeoShield.git
cd GeoShield/backend
python -m pip install -r requirements.txt
```

### 2. Start Backend
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
# ✅ API runs at http://localhost:8000
# ✅ Frontend served from http://localhost:8000
# ✅ Database auto-seeded with 20 NER stations
```

### 3. Start Frontend (Development)
```bash
cd ../frontend
npm install
npm run dev
# ✅ Dev server at http://localhost:5173 (proxies to backend)
```

### 4. Production Build
```bash
cd frontend
npm run build
# ✅ Backend auto-serves from frontend/dist/
```

---

## 📊 Demo Results

| Metric | Value |
|--------|-------|
| Sensor Stations | 20 across 8 NER states |
| Historical Data Points | 67,200 (20 stations × 168 hours × 20 readings) |
| Risk Assessments | 960+ (48h hourly for all stations) |
| Active Alerts | 5 high-risk alerts |
| Monitored Roads | 8 (5 open, 2 partially blocked, 1 blocked) |
| Tracked Villages | 18 (6 high-risk) |
| Citizen Reports | 15 (8 pending, 7 verified) |
| Affected Population | 8,087 people |
| AI Model Accuracy | 76.5% (test set) |
| Average Risk Score | 29.6 / 100 |

### Risk by State

| State | Avg Risk Score | Stations | Status |
|-------|---------------|----------|--------|
| Nagaland | 76.1 | 2 | ⚠️ High |
| Tripura | 67.3 | 1 | ⚠️ High |
| Sikkim | 32.5 | 3 | 🟡 Moderate |
| Arunachal Pradesh | 28.0 | 4 | 🟡 Moderate |
| Manipur | 25.9 | 2 | 🟡 Moderate |
| Mizoram | 21.6 | 2 | 🟢 Low |
| Assam | 12.8 | 3 | 🟢 Low |
| Meghalaya | 9.5 | 3 | 🟢 Low |

---

## 🛰️ Real Data Sources

| Data Type | Source | Status | URL |
|-----------|--------|--------|-----|
| Historical Landslides | NASA GLC | ✅ Integrated | [Kaggle](https://kaggle.com/datasets/nasa/landslide-catalog-from-nasa) |
| India Rainfall | IMD/Kaggle | ✅ Integrated | [Kaggle](https://kaggle.com/datasets/rajkumarpandey/india-rainfall-data) |
| Weather Forecast | Open-Meteo API | ✅ Live | [Open-Meteo](https://open-meteo.com) |
| Terrain/DEM | USGS SRTM | 📋 Documented | [USGS](https://earthexplorer.usgs.gov) |
| NDVI/Satellite | Copernicus Sentinel-2 | 📋 Documented | [Copernicus](https://dataspace.copernicus.eu) |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/dashboard/risk-heatmap` | Risk heatmap data |
| GET | `/api/dashboard/rainfall-trend` | 48h rainfall trend |
| GET | `/api/dashboard/risk-trend` | 48h risk trend |
| GET | `/api/dashboard/state-summary` | State-wise summary |
| GET | `/api/sensors/stations` | All sensor stations |
| GET | `/api/sensors/stations/{id}` | Station detail + readings |
| GET | `/api/sensors/stations/{id}/history` | Historical readings |
| GET | `/api/alerts/active` | Active alerts |
| PUT | `/api/alerts/{id}/acknowledge` | Acknowledge alert |
| PUT | `/api/alerts/{id}/resolve` | Resolve alert |
| GET | `/api/reports` | Citizen reports |
| POST | `/api/reports` | Submit report |
| GET | `/api/roads` | Road status |
| GET | `/api/villages` | Village data |
| GET | `/api/weather/{station}` | Weather data |
| WS | `/ws/alerts` | Real-time alert stream |

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript | 18.2 |
| Maps | Leaflet + React-Leaflet | 1.9.4 |
| Charts | Recharts | 2.10 |
| Styling | Tailwind CSS | 3.3 |
| Icons | Lucide React | 0.294 |
| Backend | Python FastAPI | 0.104 |
| Database | SQLite + SQLAlchemy | 2.0 |
| ML/AI | scikit-learn | 1.3 |
| Real-time | WebSocket | 12.0 |
| Build | Vite | 5.0 |

---

## 📜 License

MIT License — Built for Smart India Hackathon 2026

---

<p align="center">
  <strong>Team GeoShield</strong> | SIH 2026 | MDoNER | Disaster Management<br>
  <em>Protecting Lives Through AI-Powered Early Warning</em>
</p>
