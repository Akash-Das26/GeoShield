"""
GeoShield End-to-End Integration Test
Verifies every feature works together with visible results.
Run: cd backend && python3 tests/test_e2e.py
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
PASS = 0
FAIL = 0

def t(name, condition, detail=""):
    global PASS, FAIL
    if condition:
        PASS += 1
        print(f"  ✅ {name}")
    else:
        FAIL += 1
        print(f"  ❌ {name}: {detail}")

print("╔══════════════════════════════════════════════════╗")
print("║  GEOSHIELD END-TO-END INTEGRATION TEST          ║")
print("╚══════════════════════════════════════════════════╝")

# ═══ 1. Core Backend ═══
print("\n═══ 1. Core Backend ═══")
r = client.get("/api/health")
t("Health check", r.status_code == 200 and r.json()["status"] == "healthy")

r = client.post("/api/auth/login", data={"email": "admin@geoshield.gov.in", "password": "admin123"})
token = r.json().get("token", "")
t("Login JWT token", len(token) > 20, f"got {len(token)} chars")
headers = {"Authorization": f"Bearer {token}"}

r = client.get("/")
t("Frontend serves", r.status_code == 200)

# ═══ 2. Dashboard ═══
print("\n═══ 2. Dashboard ═══")
r = client.get("/api/dashboard/stats")
d = r.json()
print(f"  📊 Stations={d['total_stations']}, Alerts={d['active_alerts']}, Risk={d['average_risk_score']}")
t("Dashboard stats", d["total_stations"] == 20)

r = client.get("/api/dashboard/risk-heatmap")
t(f"Heatmap: {len(r.json())} points", len(r.json()) == 20)

r = client.get("/api/dashboard/rainfall-trend")
print(f"  🌧️ Rainfall trend: {len(r.json())} hourly points")
t(f"Rainfall trend {len(r.json())}h", len(r.json()) >= 24)

r = client.get("/api/dashboard/risk-trend")
print(f"  📈 Risk trend: {len(r.json())} hourly points")
t(f"Risk trend {len(r.json())}h", len(r.json()) >= 24)

r = client.get("/api/dashboard/state-summary")
t(f"State summary: {len(r.json())} states", len(r.json()) == 8)

# ═══ 3. Stations ═══
print("\n═══ 3. Sensor Stations ═══")
r = client.get("/api/sensors/stations")
stations = r.json()
t(f"Station list: {len(stations)}", len(stations) == 20)

r = client.get("/api/sensors/stations/NER-001")
detail = r.json()
print(f"  📡 Gangtok: {len(detail['readings'])} readings, risk={detail['risk_assessment']['risk_score']}")
t("Station detail + AI risk", len(detail["readings"]) > 0 and "risk_assessment" in detail)

r = client.get("/api/sensors/stations/NER-001/history?hours=24")
t(f"Station history: {len(r.json())} points", len(r.json()) > 0)

# ═══ 4. Alerts ═══
print("\n═══ 4. Alerts System ═══")
r = client.get("/api/alerts")
alerts = r.json()
print(f"  🚨 Alert list: {len(alerts)} total")
t(f"Alerts list: {len(alerts)}", len(alerts) > 10)

r = client.get("/api/alerts/stats")
stats = r.json()
print(f"  📊 Stats: total={stats['total']} active={stats['active']}")
t("Alert stats", stats["total"] > 10)

r = client.get("/api/alerts/timeline")
tl = r.json()
print(f"  ⏱️ Timeline: {len(tl['timeline'])} entries, affected={tl['summary']['total_affected_population']}")
t(f"Alert timeline: {len(tl['timeline'])}", len(tl["timeline"]) > 0)

r = client.get("/api/alerts/history")
print(f"  📅 Alert history: {len(r.json())} daily records")
t(f"Alert history: {len(r.json())} days", len(r.json()) >= 20)

# ═══ 5. Simulator → Alert Flow ═══
print("\n═══ 5. Simulator → Alert Creation ═══")
before_count = client.get("/api/alerts/stats").json()["total"]

r = client.post("/api/simulate/landslide",
    json={"station_id": "NER-011", "intensity": "critical"},
    headers=headers)
sim = r.json()
risk = sim["risk_assessment"]
alert = sim.get("alert")
print(f"  ⚡ Simulated at Cherrapunji: risk={risk['risk_score']}/{risk['risk_level']}")
print(f"  🚨 Alert: {alert['title'][:50] if alert else 'none'}")
t("Simulate creates critical risk", risk["risk_score"] >= 75 and risk["risk_level"] == "critical")
t("Simulate creates alert", alert is not None and alert.get("title"))

after_count = client.get("/api/alerts/stats").json()["total"]
t(f"Alert count grew: {before_count} → {after_count}", after_count > before_count)

# ═══ 6. AI Prediction ═══
print("\n═══ 6. AI Prediction ═══")
r = client.post("/api/predict", json={
    "latitude": 25.28, "longitude": 91.73,
    "slope": 45, "elevation": 1400, "rainfall_mm": 80
})
pred = r.json()
ra = pred["risk_assessment"]
print(f"  🤖 Cherrapunji area: risk={ra['risk_score']}/{ra['risk_level']}, prob={ra['landslide_probability']}")
print(f"  📍 Nearest station: {pred['nearest_station']['name']} ({pred['nearest_station']['distance_km']}km)")
print(f"  🔍 Factors: {', '.join(ra['contributing_factors'][:3])}")
t("AI prediction with factors", ra["risk_score"] > 0 and len(ra["contributing_factors"]) > 0)
t("Risk level consistent", ra["risk_level"] in ["low", "moderate", "high", "critical"])

# ═══ 7. Flood Data ═══
print("\n═══ 7. Flood Data ═══")
r = client.get("/api/flood/data")
flood = r.json()
print(f"  🌊 {flood['total_districts']} districts monitored")
t(f"Flood data: {flood['total_districts']} districts", flood["total_districts"] > 10)

r = client.get("/api/flood/summary")
fs = r.json()
print(f"  📊 Avg risk={fs['avg_risk_score']}, Max={fs['max_risk_district']} ({fs['max_risk_score']})")
t("Flood summary", fs["avg_risk_score"] > 0)

r = client.get("/api/flood/correlation")
corr = r.json()
print(f"  🔗 {len(corr['correlation'])} districts correlated (flood × landslide)")
t("Flood-landslide correlation", len(corr["correlation"]) > 0)

# ═══ 8. Satellite Data ═══
print("\n═══ 8. Satellite Data ═══")
r = client.get("/api/satellite/data")
sat = r.json()
print(f"  🛰️ {sat['total_stations']} stations with real Open-Meteo data")
t("Satellite data: 20 stations", sat["total_stations"] == 20)

r = client.get("/api/satellite/summary")
ss = r.json()
print(f"  📏 Elevation range: {ss['elevation']['min']}m - {ss['elevation']['max']}m (avg {ss['elevation']['avg']}m)")
t("Satellite summary", ss["elevation"]["avg"] > 0)

r = client.get("/api/satellite/risk-zones")
t(f"Satellite risk zones: {len(r.json())}", len(r.json()) == 20)

# ═══ 9. Weather ═══
print("\n═══ 9. Weather Data ═══")
r = client.get("/api/weather/NER-001")
w = r.json()["data"]
print(f"  ☁️ Temp={w['temperature']}°C, Rain24h={w['rainfall_24h']}mm, Humidity={w['humidity']}%")
t("Weather data", w["temperature"] > 0)

r = client.get("/api/weather/NER-001/forecast?hours=48")
print(f"  📅 Forecast: {len(r.json())} data points")
t(f"Weather forecast: {len(r.json())}", len(r.json()) > 0)

# ═══ 10. Export ═══
print("\n═══ 10. Data Export ═══")
r = client.get("/api/export/geojson")
geojson = r.json()
print(f"  🗺️ GeoJSON: {len(geojson['features'])} station features")
t("GeoJSON export", len(geojson["features"]) == 20)

r = client.get("/api/export/csv")
csv_lines = r.content.decode().strip().split("\n")
print(f"  📄 CSV: {len(csv_lines)} lines (header + {len(csv_lines)-1} stations)")
t("CSV export", len(csv_lines) > 20)

r = client.get("/api/export/risk-zones")
rz = r.json()
print(f"  🔴 Risk zones: {len(rz['features'])} high-risk polygons")
t("Risk zones export", len(rz["features"]) > 0)

# ═══ 11. Infrastructure ═══
print("\n═══ 11. Infrastructure ═══")
r = client.get("/api/roads")
roads = r.json()
print(f"  🛣️ {len(roads)} roads monitored across NER")
t(f"Roads: {len(roads)}", len(roads) >= 40)

r = client.get("/api/villages")
villages = r.json()
print(f"  🏘️ {len(villages)} villages tracked")
t(f"Villages: {len(villages)}", len(villages) >= 15)

r = client.get("/api/reports")
reports = r.json()
print(f"  📝 {len(reports)} citizen reports")
t(f"Reports: {len(reports)}", len(reports) > 0)

# ═══ 12. Frontend Routes ═══
print("\n═══ 12. Frontend SPA Routes ═══")
routes = ["/", "/map", "/alerts", "/reports", "/simulator", "/satellite", "/flood", "/demo"]
for route in routes:
    r = client.get(route)
    t(f"Route {route}", r.status_code == 200)

# ═══ 13. Alert Workflow ═══
print("\n═══ 13. Alert Acknowledge Workflow ═══")
r = client.get("/api/alerts/active")
active = r.json()
if active:
    alert_id = active[0]["id"]
    r = client.put(f"/api/alerts/{alert_id}/acknowledge", headers=headers)
    t(f"Acknowledge alert #{alert_id}", r.status_code == 200)
else:
    t("Acknowledge alert", False, "no active alerts")

# ═══ 14. Security ═══
print("\n═══ 14. Security ═══")
r = client.post("/api/auth/login", data={"email": "bad", "password": "bad"})
t("Invalid login → 401", r.status_code == 401)

r = client.post("/api/simulate/landslide", json={"intensity": "low"})
t("Unauthenticated sim → 401", r.status_code == 401)

r = client.post("/api/predict", json={"latitude": 999})
t("Invalid input → 422", r.status_code == 422)

# ═══ FINAL ═══
total = PASS + FAIL
print()
print("╔══════════════════════════════════════════════════╗")
print(f"║  FINAL: {PASS}/{total} PASSED, {FAIL} FAILED")
print("╚══════════════════════════════════════════════════╝")

if FAIL > 0:
    sys.exit(1)
