# 📊 GeoShield — Complete Dataset Manifest

## 📋 Overview

This document lists ALL datasets used, available, and ready to integrate in GeoShield.

---

## ✅ Integrated Datasets (Currently in Use)

| # | Dataset | Source | Samples | Features | Status |
|---|---------|--------|---------|----------|--------|
| 1 | **Real NER Training Data** | Previous prototype | 2,000 | slope, elevation, aspect, rainfall, NDVI, soil_moisture, distance_to_road, land_cover | ✅ Training AI model |
| 2 | **Demo NER Data** | Previous prototype | ~500 | lat, lng, elevation, slope, rainfall, soil_moisture, ndvi, landslide | ✅ Demo purposes |
| 3 | **Sensor Station Data** | Generated (realistic) | 67,200 | rainfall, soil_moisture, temperature, displacement, tilt, pore_pressure, vibration | ✅ 20 stations × 168 hours |
| 4 | **Risk Assessments** | AI Model | 960+ | risk_score, risk_level, probability, contributing_factors | ✅ 48h hourly |
| 5 | **Weather Data** | Generated (realistic) | 2,800 | temperature, humidity, rainfall, wind, pressure, forecast | ✅ 3-hour intervals |

---

## 🛰️ Real Satellite Data Sources (Ready to Download)

### 1. SRTM DEM — Terrain/Elevation Data
- **Source:** USGS EarthExplorer
- **URL:** https://earthexplorer.usgs.gov/
- **Data:** 30m resolution elevation, slope, aspect
- **Coverage:** Global (including NER)
- **Format:** GeoTIFF
- **Size:** ~500MB-1GB for NER
- **Cost:** FREE (no credit card)
- **Integration Script:** `datasets/integrate_real_data.py`

### 2. Sentinel-2 NDVI — Vegetation Index
- **Source:** Copernicus Data Space
- **URL:** https://dataspace.copernicus.eu/
- **Data:** 10m resolution NDVI (Normalized Difference Vegetation Index)
- **Coverage:** Global (including NER)
- **Format:** GeoTIFF
- **Cost:** FREE (no credit card)
- **Integration Script:** `datasets/download_ndvi.py`
- **Methods:** openEO API, MODIS MOD13Q1, or simulated

### 3. SMAP Soil Moisture — Satellite Soil Moisture
- **Source:** NASA SMAP
- **URL:** https://smap.jpl.nasa.gov/data/
- **Data:** 9km resolution soil moisture
- **Coverage:** Global
- **Format:** HDF5/NetCDF
- **Cost:** FREE

### 4. IMD Gridded Rainfall — Official Indian Rainfall
- **Source:** India Meteorological Department
- **URL:** https://www.imdpune.gov.in/cmpg/Griddata/Rainfall_25_NetCDF.html
- **Data:** 0.25° resolution daily rainfall (1901-2024)
- **Coverage:** India
- **Format:** NetCDF
- **Cost:** FREE

### 5. MOSDAC Soil Wetness — Indian Satellite Data
- **Source:** ISRO MOSDAC
- **URL:** https://mosdac.gov.in/soil-moisture-0
- **Data:** Soil wetness index from Indian satellites
- **Coverage:** India
- **Cost:** FREE

---

## 📥 Kaggle Datasets (Available for Download)

### 6. NASA Global Landslide Catalog
- **Source:** Kaggle
- **URL:** https://www.kaggle.com/datasets/nasa/landslide-catalog-from-nasa
- **Data:** 1,693 worldwide landslide events with lat/lng, trigger, severity
- **Size:** 432 KB
- **Features:** event_date, location, trigger, fatalities, damage

### 7. India Rainfall Data (1901-2015)
- **Source:** Kaggle
- **URL:** https://www.kaggle.com/datasets/rajanand/rainfall-in-india
- **Data:** Monthly rainfall by subdivision (including NER)
- **Size:** 516 KB
- **Features:** year, month, subdivision, rainfall

### 8. India Landslide Incidents (2016-2020)
- **Source:** Kaggle
- **URL:** https://www.kaggle.com/datasets/kkhandekar/lanslide-recent-incidents-india
- **Data:** India-specific landslide events
- **Size:** 56 KB
- **Features:** date, location, state, cause, casualties

### 9. Landslide & Flood India
- **Source:** Kaggle
- **URL:** https://www.kaggle.com/datasets/sahilrajverma/landslide
- **Data:** India landslide and flood analysis data
- **Size:** 7 MB
- **Features:** Various risk factors

### 10. Landslide Risk Assessment Factors
- **Source:** Kaggle
- **URL:** https://www.kaggle.com/datasets/rajumavinmar/landslide-dataset
- **Data:** Factors influencing landslides
- **Features:** rainfall, slope_angle, soil_properties, vegetation, earthquake

### 11. Wireless Sensor Network Landslide Dataset
- **Source:** Kaggle
- **URL:** https://www.kaggle.com/datasets/ucimachinelearning/wireless-sensor-network-landslide-dataset
- **Data:** Real sensor readings for landslide prediction
- **Features:** rainfall_24h, soil_moisture, vibration, displacement

### 12. Global Landslide Data
- **Source:** Kaggle
- **URL:** https://www.kaggle.com/datasets/kazushiadachi/global-landslide-data
- **Data:** Global landslide catalog with triggers and impacts

---

## 🗺️ NER-Specific Data Sources

### 13. NESDR NER Landslide Map
- **Source:** North Eastern Spatial Data Repository
- **URL:** https://www.nesdr.gov.in/dataset/ner-landslide-map
- **Data:** NER landslide incidents 2020-2021
- **Format:** Excel/Shapefile
- **Cost:** FREE

### 14. India District Boundaries
- **Source:** Kaggle
- **URL:** https://www.kaggle.com/datasets/ashishkumarjha/india-district-wise-shape-file
- **Data:** District polygon shapefiles
- **Use:** Map risk zones to actual districts

### 15. India Road Network
- **Source:** OpenStreetMap
- **URL:** https://www.kaggle.com/datasets/blessonbinjosep/indian-roads
- **Data:** Road polylines for India
- **Use:** Real road connectivity monitoring

---

## 📊 Data Statistics

| Metric | Value |
|--------|-------|
| Total integrated datasets | 5 |
| Total real training samples | 2,000 |
| Total sensor readings | 67,200 |
| Total risk assessments | 960+ |
| Available Kaggle datasets | 7 |
| Available satellite sources | 5 |
| NER-specific sources | 3 |

---

## 🔄 Data Pipeline

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  📥 DOWNLOAD      │────▶│  🔧 PROCESS       │────▶│  🤖 TRAIN        │
│  Raw Data         │     │  Clean & Feature  │     │  AI Model        │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│ • USGS SRTM DEM  │     │ • Extract values  │     │ • RF + GB        │
│ • Copernicus NDVI│     │ • Compute slope   │     │ • 9 features     │
│ • Kaggle CSVs    │     │ • Normalize       │     │ • 2000 samples   │
│ • IMD Rainfall   │     │ • Handle missing  │     │ • 75% accuracy   │
│ • SMAP Moisture  │     │ • Merge datasets  │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## 🚀 How to Add More Data

### Step 1: Download
```bash
# Using Kaggle CLI
kaggle datasets download -d nasa/landslide-catalog-from-nasa -p datasets/raw/
kaggle datasets download -d rajanand/rainfall-in-india -p datasets/raw/

# Using our scripts
python datasets/prepare_datasets.py
python datasets/download_ndvi.py
```

### Step 2: Process
```bash
# Process raw data
python datasets/data_preprocessing.py

# Integrate satellite data
python datasets/integrate_real_data.py
```

### Step 3: Retrain
```bash
# Retrain AI model with new data
cd backend
python -c "from app.ai_engine.risk_predictor import get_predictor; get_predictor()"
```

---

## 📝 Notes

- All Kaggle datasets require free account (no credit card)
- USGS and Copernicus require free registration
- SMAP and IMD data are freely accessible
- Real satellite data significantly improves model accuracy
- The system automatically falls back to synthetic data if real data is unavailable

---

*Last updated: August 2026*
*For SIH 2026 Problem Statement SIH26001*
