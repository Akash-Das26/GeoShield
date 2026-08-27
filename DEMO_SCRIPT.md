# 🎬 GeoShield — 3-Minute Demo Video Script

## Pre-Demo Checklist
- [ ] Backend running on localhost:8000
- [ ] Browser open with GeoShield loaded
- [ ] Screen recording software ready
- [ ] Team intro slide ready

---

## Timeline

### 0:00 - 0:15 | Opening Hook
**[Screen: Dashboard]**

> "Every year, landslides in North Eastern India kill hundreds and leave thousands stranded. Currently, there is NO real-time predictive system for the region. Today, we present GeoShield — an AI-powered early warning system that PREDICTS landslides before they happen."

### 0:15 - 0:30 | Problem Statement
**[Screen: SIH Problem Statement slide]**

> "Our problem statement from MDoNER asks us to build an AI-based early warning and landslide risk monitoring system for NER. We need to collect rainfall, soil moisture, satellite imagery, and terrain data — then use AI to predict risks and alert authorities in real-time."

### 0:30 - 1:00 | Dashboard Demo
**[Screen: Dashboard — zoom into stats cards]**

> "Here's our live dashboard. We have 20 sensor stations across all 8 NER states — from Sikkim to Arunachal Pradesh. Right now, 5 high-risk alerts are active, affecting 8,087 people. Our AI model analyzes 15 features including rainfall, soil moisture, ground displacement, and slope angle to generate risk scores from 0 to 100."

**[Hover over rainfall trend chart]**

> "This shows 48 hours of rainfall data across all stations. You can see the monsoon patterns."

**[Hover over risk distribution pie]**

> "Risk distribution: 6 stations at low risk, 10 moderate, and 4 at high risk. Nagaland has the highest average risk at 76.1."

### 1:00 - 1:30 | GIS Map Demo
**[Screen: Risk Map]**

> "Our GIS dashboard shows the entire NER region. Each marker represents a sensor station, color-coded by risk level. Green is low, yellow is moderate, orange is high, red is critical."

**[Click on a high-risk station]**

> "Let's look at Dimapur in Nagaland — the highest risk station at 81.2 out of 100. The AI detected heavy rainfall combined with steep terrain."

**[Toggle road layer]**

> "We also monitor road connectivity. This red line shows NH-10 is blocked by landslide debris. Authorities can immediately reroute emergency vehicles."

**[Toggle village layer]**

> "These are the 18 villages we track. The red markers are high-risk zones — like Lamka in Manipur with 35,000 people."

### 1:30 - 2:00 | Station Detail Demo
**[Screen: Station Detail — click a station]**

> "When we click any station, we get full sensor readings. Here's Gangtok North Slope — 1650 meters elevation, 38-degree slope angle."

**[Show rainfall chart]**

> "24 hours of rainfall history. You can see the spikes during heavy rain events."

**[Show AI assessment]**

> "And here's our AI risk assessment. The circular gauge shows the risk score. Below, the contributing factors — rainfall, soil moisture, ground displacement. The model also predicts a time window and gives evacuation recommendations."

### 2:00 - 2:20 | Citizen Reports
**[Screen: Reports page]**

> "Citizens and field officers can submit reports directly. They select the report type — cracks, slope movement, blocked roads — add a description, and the system auto-captures their GPS location. Reports appear here for verification."

**[Show submit form]**

> "It supports multilingual input — English, Hindi, Bengali, and Assamese — because NER has diverse languages."

### 2:20 - 2:40 | AI Model Explanation
**[Screen: Architecture diagram or code]**

> "Under the hood, our AI engine uses an ensemble of Random Forest and Gradient Boosting with soft voting. It's trained on 5,000 samples with 15 input features. The model achieves 76.5% test accuracy and generates continuous risk scores with landslide probability estimates."

### 2:40 - 3:00 | Impact & Closing
**[Screen: Dashboard — full view]**

> "GeoShield is not just a dashboard — it's a complete early warning ecosystem. It PREDICTS risks before landslides happen, PROTECTS people through automated alerts, and EMPOWERS citizens through crowd-sourced reporting. We've built a working prototype with 67,200+ real data points, monitoring 20 stations across 8 states, protecting over 8,000 people."

**[Screen: Team slide]**

> "Team GeoShield — 6 members, one mission: protecting lives through AI-powered early warning. Thank you."

---

## Key Talking Points for Q&A

1. **Why AI?** "Manual reporting is too slow. Our AI predicts risks in real-time using 15 sensor features."
2. **Real data?** "We use NASA landslide catalog, Open-Meteo weather API, and 7 days of historical sensor data."
3. **Scalability?** "Adding a new station is trivial — just register coordinates and connect sensors."
4. **Offline support?** "Roadmap Phase 2 includes PWA for low-network areas."
5. **Cost?** "The system uses free APIs and open-source tools. Hardware sensors cost ~₹5,000 each."
