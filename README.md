# 🛡️ GeoShield

### AI-Based Early Warning & Landslide Risk Monitoring System for North Eastern Region

<p align="center">
  <img src="branding/team_logo.png" width="200" alt="Team GeoShield Logo">
</p>

<p align="center">
  <strong>Smart India Hackathon 2026</strong><br>
  Problem Statement: <strong>SIH26001</strong> | Theme: <strong>Disaster Management</strong><br>
  Organization: <strong>Ministry of Development of North Eastern Region (MDoNER)</strong>
</p>

<p align="center">
  <a href="https://github.com/officialarghya29/GeoShield">
    <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  </a>
  <a href="https://github.com/officialarghya29/GeoShield">
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  </a>
  <a href="https://github.com/officialarghya29/GeoShield">
    <img src="https://img.shields.io/badge/AI%2FML-scikit--learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white" alt="AI/ML">
  </a>
  <a href="https://github.com/officialarghya29/GeoShield">
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
  </a>
</p>

---

## 🏆 Team GeoShield

| Name | Roll No |
|------|---------|
| Arghya Bose | 24155380 |
| Arindam Tripathi | 24155614 |
| Arnab Pal | 24155615 |
| Aaditree Shreya | 24155371 |
| Ankan Nag | 2405791 |
| Akash Das | 24155155 |

---

## 📌 Table of Contents

- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [How It Works — Complete Workflow](#-how-it-works--complete-workflow)
- [System Architecture](#-system-architecture)
- [AI/ML Prediction Engine](#-aiml-prediction-engine)
- [Live Demo Results](#-live-demo-results)
- [Sensor Network](#-sensor-network)
- [GIS Risk Map](#-gis-risk-map)
- [Early Warning System](#-early-warning-system)
- [Citizen Reporting](#-citizen-reporting)
- [Data Sources](#-data-sources)
- [Tech Stack](#-tech-stack)
- [API Reference](#-api-reference)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Future Roadmap](#-future-roadmap)

---

## 🎯 The Problem

The **North Eastern Region** of India is one of the most landslide-prone areas in the world.

| Fact | Detail |
|------|--------|
| **Annual Landslides** | 200+ events across 8 states |
| **Road Blockages** | 70% from landslides, delaying emergency response by hours/days |
| **Villages Isolated** | Remote areas cut off for days with no early warning |
| **Current System** | Reactive, manual reporting, no predictive capability |
| **Climate Trend** | Increasing rainfall intensity due to climate change |

> *"Currently, monitoring of vulnerable zones is mostly reactive and dependent on manual reporting. There is limited use of real-time predictive systems for identifying high-risk zones."*
> — SIH26001 Problem Statement, MDoNER

### What's Missing Today

```
❌ No real-time predictive system for NER
❌ No AI-based risk assessment
❌ No centralized monitoring dashboard
❌ No automated alert mechanism
❌ No citizen reporting channel
❌ No road connectivity monitoring
```

---

## 💡 Our Solution

**GeoShield** is a complete AI-powered early warning ecosystem that:

```
✅ PREDICTS  — AI model analyzes 15 features to forecast landslide risk
✅ MONITORS  — 20 sensor stations across 8 NER states in real-time
✅ WARNS     — Automated alerts to authorities and citizens
✅ VISUALIZES — Interactive GIS dashboard with risk heatmaps
✅ CONNECTS  — Citizens can report ground-level observations
✅ PROTECTS  — Evacuation recommendations and time windows
```

---

## 🔄 How It Works — Complete Workflow

### End-to-End Pipeline

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  📡 SENSOR   │────▶│  ⚙️ PROCESS   │────▶│  🤖 PREDICT   │────▶│  🚨 ALERT    │
│  DATA IN     │     │  & STORE     │     │  RISK SCORE   │     │  AUTHORITIES │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │                    │
  Rainfall            SQLite DB            ML Ensemble          SMS/Push/
  Soil Moisture       Time Series          RF + GB              Dashboard
  Displacement        Feature Eng.         0-100 Score          WebSocket
  Tilt Angle          Validation           Probability          Email
  Pore Pressure                            Time Window
  Vibration                                Recommendations
```

### Step-by-Step Workflow

| Step | Action | Component | Frequency |
|------|--------|-----------|-----------|
| 1 | Sensors collect rainfall, moisture, displacement, tilt data | IoT Sensors | Every minute |
| 2 | Data transmitted to backend API | FastAPI Server | Real-time |
| 3 | Raw data stored in SQLite with timestamps | Database | Every reading |
| 4 | AI engine extracts 15 features from latest readings | ML Pipeline | Every 30 sec |
| 5 | Ensemble model predicts risk score (0-100) | RF + GB Model | Every 30 sec |
| 6 | Risk level assigned: Low / Moderate / High / Critical | Risk Classifier | Immediate |
| 7 | If risk > threshold → Alert generated | Alert System | Immediate |
| 8 | Alert broadcast via WebSocket to dashboard | Real-time Push | Immediate |
| 9 | SMS/Notification sent to district authority | Notification Service | Immediate |
| 10 | Dashboard updates with new risk visualization | React Frontend | Every 30 sec |
| 11 | Citizens can submit geo-tagged reports | Citizen Portal | On-demand |
| 12 | Reports verified and fed back into model | Feedback Loop | Manual review |

### Data Flow Diagram

```
                    ┌─────────────────────────┐
                    │      DATA SOURCES        │
                    ├─────────────────────────┤
                    │ 🌧️ Rainfall Patterns     │
                    │ 💧 Soil Moisture Sensors  │
                    │ 🛰️ Satellite Imagery      │
                    │ 🏔️ Terrain/Slope Data     │
                    │ 📊 Historical Records     │
                    │ ☁️ Weather API            │
                    │ 📱 Citizen Reports        │
                    └───────────┬─────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │   BACKEND API SERVER     │
                    │   (FastAPI + Python)     │
                    ├─────────────────────────┤
                    │ • Data Validation        │
                    │ • Feature Extraction     │
                    │ • Database Storage       │
                    │ • WebSocket Broadcast    │
                    │ • REST API Endpoints     │
                    └───────────┬─────────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           ▼
            ┌──────────┐ ┌──────────┐ ┌──────────┐
            │ 🤖 AI/ML  │ │ 🗺️ GIS   │ │ 🚨 ALERT │
            │ ENGINE   │ │  MAP    │ │ SYSTEM  │
            ├──────────┤ ├──────────┤ ├──────────┤
            │ RF + GB  │ │ Leaflet │ │ WebSocket│
            │ Ensemble │ │ Heatmap │ │ SMS/Push │
            │ Risk 0-100│ │ Roads  │ │ Email   │
            └──────────┘ └──────────┘ └──────────┘
                    │           │           │
                    └───────────┼───────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │    REACT FRONTEND        │
                    ├─────────────────────────┤
                    │ 📊 Dashboard             │
                    │ 🗺️ Risk Map              │
                    │ 🚨 Alerts                │
                    │ 📝 Reports               │
                    │ 🏢 Station Detail        │
                    └─────────────────────────┘
```

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          GeoShield Platform                           │
├────────────────┬──────────────────────┬──────────────────────────────┤
│                │                      │                              │
│  🖥️ Frontend     │   ⚙️ Backend API       │   🤖 AI/ML Engine             │
│  React 18      │   FastAPI 0.104      │   Random Forest              │
│  TypeScript    │   Python 3.12        │   Gradient Boosting          │
│  Vite 5.0      │   SQLite + ORM       │   Soft Voting Ensemble       │
│  Leaflet 1.9   │   WebSocket          │   15 Input Features          │
│  Recharts 2.10 │   REST APIs          │   Risk Score 0-100           │
│  TailwindCSS 3 │   Auto-seed DB       │   Time Window Prediction     │
│                │                      │                              │
├────────────────┴──────────────────────┴──────────────────────────────┤
│                           📡 Data Layer                               │
│  🌧️ Rainfall  │  💧 Soil Moisture  │  🛰️ NDVI  │  🏔️ DEM             │
│  📊 Landslide History  │  ☁️ Weather API  │  📱 Citizen Reports          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI/ML Prediction Engine

### Model Architecture

```
┌─────────────────────────────────────────────────────┐
│              ENSEMBLE MODEL (Soft Voting)            │
├─────────────────────────┬───────────────────────────┤
│    Random Forest        │    Gradient Boosting      │
│    200 estimators       │    150 estimators         │
│    max_depth: 15        │    max_depth: 8           │
│    class_weight: bal.   │    learning_rate: 0.1     │
│    Weight: 0.4          │    Weight: 0.6            │
├─────────────────────────┴───────────────────────────┤
│    Final Prediction: Weighted Average of Both       │
│    Risk Score: 0-100 continuous scale               │
│    Risk Level: Low / Moderate / High / Critical     │
└─────────────────────────────────────────────────────┘
```

### 15 Input Features

| # | Feature | Category | Source | Range |
|---|---------|----------|--------|-------|
| 1 | Rainfall (1h) | Weather | Sensor | 0-200 mm |
| 2 | Soil Moisture | Soil | Sensor | 0-100% |
| 3 | Soil Temperature | Soil | Sensor | 15-40°C |
| 4 | Ground Displacement | Movement | Sensor | 0-50 mm |
| 5 | Tilt Angle X | Movement | Sensor | -5 to 5° |
| 6 | Tilt Angle Y | Movement | Sensor | -5 to 5° |
| 7 | Pore Water Pressure | Soil | Sensor | 0-100 kPa |
| 8 | Vibration Level | Movement | Sensor | 0-100 |
| 9 | Slope Angle | Terrain | DEM | 5-60° |
| 10 | Elevation | Terrain | DEM | 100-3000 m |
| 11 | Vegetation Cover (NDVI) | Land Cover | Satellite | 0-100% |
| 12 | Rainfall 24h | Weather | Computed | 0-500 mm |
| 13 | Rainfall 7d | Weather | Computed | 0-2000 mm |
| 14 | Days Since Last Rain | Temporal | Computed | 0-30 days |
| 15 | Cumulative Rainfall 3d | Weather | Computed | 0-600 mm |

### Model Performance

| Metric | Value |
|--------|-------|
| Training Samples | 5,000 |
| Test Samples | 1,000 |
| Training Accuracy | **100.0%** |
| Test Accuracy | **76.5%** |
| Features Used | 15 |
| Model Size | ~2 MB |
| Inference Time | **< 50ms** per station |

### Risk Scoring

```
Score Range    │ Risk Level   │ Action Required
───────────────┼──────────────┼──────────────────────────────
0 - 24         │ 🟢 LOW       │ Normal monitoring
25 - 49        │ 🟡 MODERATE  │ Enhanced monitoring, prepare plans
50 - 74        │ 🟠 HIGH      │ Pre-position rescue teams, voluntary evacuation
75 - 100       │ 🔴 CRITICAL  │ IMMEDIATE EVACUATION, activate sirens
```

---

## 📊 Live Demo Results

### System Status

| Metric | Value | Status |
|--------|-------|--------|
| Sensor Stations | **20** | ✅ All online |
| NER States Covered | **8** | ✅ Complete |
| Historical Data Points | **67,200** | ✅ 7 days hourly |
| Risk Assessments | **960+** | ✅ 48h hourly |
| Active Alerts | **5** | ⚠️ High risk |
| Monitored Roads | **8** | 1 blocked |
| Tracked Villages | **18** | 6 high-risk |
| Citizens at Risk | **8,087** | 🚨 Alert needed |
| Citizen Reports | **15** | 8 pending |
| Average Risk Score | **43.0** / 100 | 🟡 Moderate |

### Risk Distribution Across 20 Stations

```
🟢 LOW      ████████████░░░░░░░░░░░░░░░░░░  6 stations (30%)
🟡 MODERATE ██████████████████████████░░░░  10 stations (50%)
🟠 HIGH     ████████████████░░░░░░░░░░░░░░  4 stations (20%)
🔴 CRITICAL ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0 stations (0%)
```

### Risk by State (Ranked)

| Rank | State | Avg Risk Score | Stations | Risk Level |
|------|-------|---------------|----------|------------|
| 1 | Nagaland | **76.1** | 2 | 🔴 HIGH |
| 2 | Tripura | **67.3** | 1 | 🟠 HIGH |
| 3 | Sikkim | **32.5** | 3 | 🟡 MODERATE |
| 4 | Arunachal Pradesh | **28.0** | 4 | 🟡 MODERATE |
| 5 | Manipur | **25.9** | 2 | 🟡 MODERATE |
| 6 | Mizoram | **21.6** | 2 | 🟢 LOW |
| 7 | Assam | **12.8** | 3 | 🟢 LOW |
| 8 | Meghalaya | **9.5** | 3 | 🟢 LOW |

### Top 5 Highest Risk Stations

| Station | Location | Risk Score | Risk Level | Key Factor |
|---------|----------|-----------|------------|------------|
| Dimapur Lowlands | Nagaland | **81.2** | 🔴 HIGH | Low elevation, high rainfall |
| Kohima Ridge | Nagaland | **71.0** | 🟠 HIGH | Steep slope, ridge terrain |
| Agartala Slope | Tripura | **67.3** | 🟠 HIGH | Tertiary sediment soil |
| Mangan Hill | Sikkim | **65.1** | 🟠 HIGH | Weathered rock, steep |
| Itanagar Foothills | Arunachal | **44.5** | 🟡 MODERATE | Transitional zone |

### Road Connectivity Status

```
🛣️ ROAD STATUS (8 Monitored Roads)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ OPEN (5 roads)
   ├── NH-10    Siliguri → Gangtok
   ├── NH-2     Dimapur → Kohima
   ├── NH-6     Shillong → Tura
   ├── NH-29    Guwahati → Shillong
   └── NH-415   Itanagar → Bomdila

⚠️ PARTIALLY BLOCKED (2 roads)
   ├── NH-37    Guwahati → Jorhat    [Partial debris]
   └── SH-4     Haflong → North Cachar [Partial debris]

🔴 BLOCKED (1 road)
   └── SH-1     Aizawl → Lunglei     [Landslide debris]
```

### Active Alerts

| Alert | Station | Risk | People Affected | Status |
|-------|---------|------|----------------|--------|
| Gangtok North Slope | NER-001 | 🟠 HIGH | 3,317 | Active |
| Mangan Hill Monitor | NER-002 | 🟠 HIGH | 1,183 | Active |
| Churachandpur Hills | NER-007 | 🟠 HIGH | 1,423 | Active |
| Aizawl Ridge Monitor | NER-008 | 🟠 HIGH | 1,173 | Active |
| Ziro Valley Watch | NER-017 | 🟠 HIGH | 991 | Active |

---

## 📡 Sensor Network

### 20 Stations Across 8 NER States

| # | Station ID | Name | State | Elevation | Slope | Risk |
|---|-----------|------|-------|-----------|-------|------|
| 1 | NER-001 | Gangtok North Slope | Sikkim | 1650m | 38° | 🟢 13.5 |
| 2 | NER-002 | Mangan Hill Monitor | Sikkim | 950m | 42° | 🟠 65.1 |
| 3 | NER-003 | Namchi Valley Watch | Sikkim | 1315m | 35° | 🟡 19.0 |
| 4 | NER-004 | Guwahati Foothills | Assam | 550m | 28° | 🟢 9.2 |
| 5 | NER-005 | Karbi Anglong Slope | Assam | 680m | 32° | 🟢 4.7 |
| 6 | NER-006 | Imphal Valley Edge | Manipur | 786m | 36° | 🟡 23.3 |
| 7 | NER-007 | Churachandpur Hills | Manipur | 915m | 40° | 🟡 28.4 |
| 8 | NER-008 | Aizawl Ridge Monitor | Mizoram | 1080m | 44° | 🟡 24.9 |
| 9 | NER-009 | Lunglei Slope Watch | Mizoram | 720m | 38° | 🟢 18.2 |
| 10 | NER-010 | Shillong Plateau Edge | Meghalaya | 1490m | 30° | 🟢 1.2 |
| 11 | NER-011 | Cherrapunji Monitor | Meghalaya | 1430m | 33° | 🟡 25.5 |
| 12 | NER-012 | Tura Hills Watch | Meghalaya | 650m | 29° | 🟢 1.7 |
| 13 | NER-013 | Kohima Ridge | Nagaland | 1444m | 37° | 🟠 71.0 |
| 14 | NER-014 | Dimapur Lowlands | Nagaland | 196m | 12° | 🔴 81.2 |
| 15 | NER-015 | Agartala Slope Monitor | Tripura | 120m | 15° | 🟠 67.3 |
| 16 | NER-016 | Itanagar Foothills | Arunachal | 320m | 25° | 🟡 44.5 |
| 17 | NER-017 | Ziro Valley Watch | Arunachal | 1688m | 30° | 🟢 11.0 |
| 18 | NER-018 | Pasighat Monitor | Arunachal | 155m | 18° | 🟡 28.3 |
| 19 | NER-019 | Tawang Ridge | Arunachal | 3048m | 48° | 🟡 28.2 |
| 20 | NER-020 | Dima Hasao Watch | Assam | 680m | 41° | 🟡 24.6 |

### Sensor Data Per Station (Per Reading)

```
┌─────────────────────────────────────────────────┐
│           SENSOR READING STRUCTURE               │
├─────────────────────────────────────────────────┤
│  🌧️  rainfall_mm:        0.0 - 200.0 mm         │
│  💧  soil_moisture:       0.0 - 100.0 %          │
│  🌡️  soil_temperature:    15.0 - 40.0 °C         │
│  📏  ground_displacement: 0.0 - 50.0 mm          │
│  📐  tilt_angle_x:       -5.0 to 5.0 degrees     │
│  📐  tilt_angle_y:       -5.0 to 5.0 degrees     │
│  💦  pore_water_pressure: 0.0 - 100.0 kPa        │
│  📳  vibration_level:     0.0 - 100.0            │
│  ⏰  timestamp:           ISO 8601 datetime       │
└─────────────────────────────────────────────────┘
```

---

## 🗺️ GIS Risk Map

### Interactive Features

- **🗺️ Dark-themed Leaflet map** centered on NER (lat 25.5, lng 92.5)
- **🔴 Risk heatmap markers** — color-coded by risk level (Green → Red)
- **🛣️ Road overlays** — solid lines for open, dashed for blocked
- **🏘️ Village markers** — sized by population, colored by risk zone
- **🔍 Click any station** — popups with risk score and link to detail view
- **📊 Toggle layers** — show/hide stations, roads, villages independently

### Map Legend

```
MARKERS:
  🟢 Green Circle   = Low Risk (score < 25)
  🟡 Yellow Circle  = Moderate Risk (score 25-50)
  🟠 Orange Circle  = High Risk (score 50-75)
  🔴 Red Circle     = Critical Risk (score > 75)

ROADS:
  ━━━━━━━━━━━━━━━━━  = Open
  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  = Blocked
  ━ ┄ ━ ┄ ━ ┄ ━ ┄  = Partially Blocked

VILLAGES:
  ○ Small   = Population < 10,000
  ◯ Medium  = Population 10,000 - 100,000
  ⬤ Large   = Population > 100,000
```

---

## 🚨 Early Warning System

### Alert Classification

| Level | Score Range | Color | Action | Notification |
|-------|-------------|-------|--------|-------------|
| **CRITICAL** | 75-100 | 🔴 Red | IMMEDIATE EVACUATION | SMS + Push + Siren |
| **HIGH** | 50-74 | 🟠 Orange | Pre-position teams | SMS + Push |
| **MODERATE** | 25-49 | 🟡 Yellow | Enhanced monitoring | Push notification |
| **LOW** | 0-24 | 🟢 Green | Normal operations | None |

### Alert Workflow

```
Sensor Reading → AI Risk Assessment → Risk Score Calculated
        │
        ▼
Score >= 75? ──YES──▶ 🔴 CRITICAL ALERT
        │              ├── SMS to District Collector
        │              ├── Push to Disaster Management
        │              ├── Activate village sirens
        │              └── Close affected roads
        │
NO ◀────┘
        │
Score >= 50? ──YES──▶ 🟠 HIGH ALERT
        │              ├── SMS to SDM
        │              ├── Push to rescue teams
        │              └── Prepare evacuation plans
        │
NO ◀────┘
        │
Score >= 25? ──YES──▶ 🟡 MODERATE ALERT
        │              ├── Push notification
        │              └── Increase monitoring frequency
        │
NO ◀────┘
        │
        ▼
🟢 LOW — Continue normal monitoring
```

### Real-Time WebSocket Broadcasting

```
┌──────────┐     WebSocket      ┌──────────────────┐
│ Backend  │ ──────────────────▶ │ Dashboard Client │
│ Server   │   Alert Update     │ (Browser)        │
│          │   { type, count }  │                  │
└──────────┘                    └──────────────────┘
```

---

## 📝 Citizen Reporting

### Report Types

| Type | Icon | Description |
|------|------|-------------|
| Crack/Fissure | 🔍 | Visible cracks on hillside or building |
| Slope Movement | ⛰️ | Noticeable ground shifting or tilting |
| Blocked Road | 🛣️ | Road obstructed by debris or landslide |
| Flooding | 🌊 | Waterlogging near slopes or roads |
| Other | 📌 | Any other observation |

### Report Workflow

```
Citizen/Field Officer
        │
        ▼
Opens GeoShield App
        │
        ▼
Selects Report Type ──▶ Adds Description
        │
        ▼
Auto-captures GPS Location
        │
        ▼
Optional: Upload Photo
        │
        ▼
Submit Report
        │
        ▼
Report appears on Dashboard
        │
        ▼
Admin verifies or dismisses
        │
        ▼
Verified reports feed back into AI model
```

### Multilingual Support

| Language | Script | Coverage |
|----------|--------|----------|
| English | Latin | Full UI |
| Hindi | Devanagari | Full UI |
| Bengali | Bengali | Full UI |
| Assamese | Eastern Nagari | Full UI |

---

## 🛰️ Data Sources

### Currently Integrated

| Source | Type | Data | Status |
|--------|------|------|--------|
| NASA Global Landslide Catalog | Historical | 1,693 worldwide events | ✅ Integrated |
| Open-Meteo API | Live Weather | Real-time rainfall, soil moisture, forecasts | ✅ Live |
| Kaggle IMD Rainfall | Historical | Monthly rainfall 1901-2015 | ✅ Integrated |
| Synthetic IoT Sensors | Simulated | 7-day hourly readings for 20 stations | ✅ Generated |

### Ready to Integrate (Free Accounts)

| Source | Type | Data | Signup |
|--------|------|------|--------|
| USGS EarthExplorer | Terrain | SRTM DEM 30m resolution | Free, no credit card |
| Copernicus Data Space | Satellite | Sentinel-2 NDVI 10m resolution | Free, no credit card |
| IMD API | Official Weather | District-wise rainfall forecasts | Free registration |

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 18.2 | UI framework |
| **Language** | TypeScript | 5.2 | Type safety |
| **Build** | Vite | 5.0 | Fast bundler |
| **Maps** | Leaflet | 1.9.4 | Interactive GIS |
| **Charts** | Recharts | 2.10 | Data visualization |
| **Styling** | Tailwind CSS | 3.3 | Utility-first CSS |
| **Icons** | Lucide React | 0.294 | Beautiful icons |
| **Backend** | FastAPI | 0.104 | REST API server |
| **Language** | Python | 3.12 | Backend language |
| **Database** | SQLite + SQLAlchemy | 2.0 | Data persistence |
| **ML/AI** | scikit-learn | 1.3 | Risk prediction |
| **Real-time** | WebSocket | 12.0 | Live updates |
| **HTTP** | Uvicorn | 0.24 | ASGI server |

---

## 📡 API Reference

### Dashboard Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/health` | Health check | `{ status, timestamp }` |
| `GET` | `/api/dashboard/stats` | Full dashboard stats | Stations, alerts, roads, villages |
| `GET` | `/api/dashboard/risk-heatmap` | Risk heatmap data | Array of { lat, lng, risk_score } |
| `GET` | `/api/dashboard/rainfall-trend` | 48h rainfall trend | Array of { timestamp, avg_rainfall } |
| `GET` | `/api/dashboard/risk-trend` | 48h risk trend | Array of { timestamp, avg_risk } |
| `GET` | `/api/dashboard/state-summary` | State-wise summary | Array of { state, avg_risk_score } |

### Sensor Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/sensors/stations` | All stations with latest data | Array of Station objects |
| `GET` | `/api/sensors/stations/{id}` | Station detail + readings | Station with 168 readings |
| `GET` | `/api/sensors/stations/{id}/history` | Historical readings | Configurable time range |

### Alert Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/alerts` | All alerts | Filterable by status/risk |
| `GET` | `/api/alerts/active` | Active alerts only | Array of Alert objects |
| `PUT` | `/api/alerts/{id}/acknowledge` | Acknowledge alert | Success message |
| `PUT` | `/api/alerts/{id}/resolve` | Resolve alert | Success message |
| `GET` | `/api/alerts/stats` | Alert statistics | Total, active, resolved |

### Report Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/reports` | All reports | Filterable by status |
| `POST` | `/api/reports` | Submit report | Multi-part form data |
| `PUT` | `/api/reports/{id}/verify` | Verify report | Success message |
| `GET` | `/api/roads` | Road status | Array of Road objects |
| `GET` | `/api/villages` | Village data | Array of Village objects |
| `GET` | `/api/weather/{station}` | Weather data | Current + forecast |

### WebSocket

| Protocol | Endpoint | Description |
|----------|----------|-------------|
| `WS` | `/ws/alerts` | Real-time alert stream |

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### One-Command Setup

```bash
git clone https://github.com/officialarghya29/GeoShield.git
cd GeoShield
bash deploy.sh
```

### Manual Setup

```bash
# 1. Clone
git clone https://github.com/officialarghya29/GeoShield.git
cd GeoShield

# 2. Backend
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# 3. Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

### Access

| URL | Description |
|-----|-------------|
| `http://localhost:8000` | Production (backend serves frontend) |
| `http://localhost:5173` | Development (Vite dev server) |
| `http://localhost:8000/api/docs` | API documentation |

---

## 📁 Project Structure

```
GeoShield/
│
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI application entry point
│   │   ├── models.py              # SQLAlchemy ORM models (8 tables)
│   │   ├── database.py            # SQLite connection configuration
│   │   ├── seed_data.py           # NER region demo data generator
│   │   ├── seed_risk_history.py   # 48h historical risk generator
│   │   ├── ai_engine/
│   │   │   └── risk_predictor.py  # ML ensemble model (RF + GB)
│   │   ├── routers/
│   │   │   ├── sensors.py         # Sensor station CRUD + readings
│   │   │   ├── dashboard.py       # Dashboard statistics & trends
│   │   │   ├── alerts.py          # Alert management & workflow
│   │   │   ├── reports.py         # Citizen reports + roads + villages
│   │   │   └── weather.py         # Weather data endpoints
│   │   └── uploads/               # Citizen report photo storage
│   └── requirements.txt           # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                # Main app with routing & sidebar
│   │   ├── main.tsx               # React entry point
│   │   ├── index.css              # Global styles + Tailwind
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx      # Main dashboard with charts
│   │   │   ├── RiskMap.tsx        # Interactive GIS risk map
│   │   │   ├── Alerts.tsx         # Alert management page
│   │   │   ├── Reports.tsx        # Citizen report submission
│   │   │   └── StationDetail.tsx  # Individual station view
│   │   ├── services/
│   │   │   └── api.ts             # Axios API client + types
│   │   └── i18n/
│   │       └── translations.ts    # EN/HI/BN/AS translations
│   ├── public/
│   │   └── favicon.svg            # GeoShield logo
│   ├── package.json               # Node.js dependencies
│   ├── tailwind.config.js         # Tailwind configuration
│   └── vite.config.ts             # Vite build configuration
│
├── datasets/
│   ├── README.md                  # Data sources & download guide
│   └── download_datasets.py       # Dataset generator script
│
├── PRESENTATION.md                # 15-slide SIH pitch deck
├── DEPLOYMENT_GUIDE.md            # Railway/Render/Docker deploy
├── SATELLITE_INTEGRATION.md       # Real data integration guide
├── Dockerfile                     # Docker container config
├── Procfile                       # Railway deployment
├── railway.json                   # Railway config
├── render.yaml                    # Render config
├── deploy.sh                      # One-click local deploy
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

---

## 🗺️ Database Schema

### 8 Tables

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ sensor_stations  │───▶│ sensor_readings  │───▶│ risk_assessments│
│ (20 stations)    │    │ (67,200 readings)│    │ (960+ scores)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
┌─────────────────┐    ┌─────────────────┐             │
│ citizen_reports  │    │      alerts      │◀────────────┘
│ (15 reports)     │    │ (5 active)       │
└─────────────────┘    └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  weather_data    │    │   road_status    │    │    villages     │
│ (2,800 records)  │    │ (8 roads)        │    │ (18 villages)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🚀 Deployment

### Option 1: Railway (Recommended)

```bash
# 1. Go to https://railway.app
# 2. Sign up with GitHub
# 3. New Project → Deploy from GitHub repo
# 4. Select officialarghya29/GeoShield
# 5. Set PORT=8000
# 6. Deploy → Get public URL
```

### Option 2: Render

```bash
# 1. Go to https://render.com
# 2. New Web Service → Connect GitHub
# 3. Build: cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt
# 4. Start: cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
# 5. Deploy → Get public URL
```

### Option 3: Docker

```bash
docker build -t geoshield .
docker run -p 8000:8000 geoshield
# Opens at http://localhost:8000
```

### Option 4: Local

```bash
bash deploy.sh
# Opens at http://localhost:8000
```

---

## 🔮 Future Roadmap

| Phase | Feature | Priority | Timeline |
|-------|---------|----------|----------|
| **Phase 2** | Real IoT sensor deployment | HIGH | Post-SIH |
| **Phase 2** | SRTM DEM integration | HIGH | Before demo |
| **Phase 2** | Sentinel-2 NDVI integration | HIGH | Before demo |
| **Phase 3** | IMD weather API integration | MEDIUM | Post-SIH |
| **Phase 3** | Mobile app (Android/iOS) | MEDIUM | Post-SIH |
| **Phase 3** | SMS alert integration | MEDIUM | Post-SIH |
| **Phase 4** | Offline PWA for remote areas | LOW | Future |
| **Phase 4** | Multi-hazard (floods, earthquake) | LOW | Future |
| **Phase 4** | Drone integration | LOW | Future |

---

## 📜 License

MIT License — Built for Smart India Hackathon 2026

---

<p align="center">
  <strong>🛡️ Team GeoShield</strong><br>
  Smart India Hackathon 2026 | SIH26001 | MDoNER | Disaster Management<br><br>
  <em>"Protecting Lives Through AI-Powered Early Warning"</em>
</p>
