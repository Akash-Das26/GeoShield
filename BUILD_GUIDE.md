# 🏗️ GeoShield — Build Guide

## Desktop App Build Instructions

### 🐧 Linux

#### Option 1: AppImage (Portable — No Install Needed)
```bash
cd geo-shield
chmod +x dist-electron/GeoShield-1.0.0.AppImage
./dist-electron/GeoShield-1.0.0.AppImage
```

#### Option 2: DEB Package (Ubuntu/Debian)
```bash
sudo dpkg -i dist-electron/geoshield_1.0.0_amd64.deb
geoshield  # Launch from terminal
```

#### Option 3: Tar.gz (Any Linux)
```bash
tar -xzf dist-electron/geoshield-1.0.0.tar.gz
cd linux-unpacked
./GeoShield  # Launch
```

#### Rebuild from Source
```bash
cd geo-shield
# Install dependencies
cd frontend && npm install && cd ..
npm install

# Build frontend
cd frontend && npm run build && cd ..

# Build AppImage
npx electron-builder --linux --config electron-builder.json
```

---

### 🪟 Windows

#### Option 1: Portable (No Install Needed)
1. Download `GeoShield-1.0.0-Windows-x64.zip`
2. Extract to any folder
3. Run `GeoShield.exe` from `win-unpacked/` folder

#### Option 2: NSIS Installer (Requires Wine on Linux or native Windows)
```bash
# On Windows:
cd geo-shield
npm install
npx electron-builder --win --config electron-builder.json
# Output: dist-electron/GeoShield-1.0.0-Setup.exe
```

#### Rebuild from Source (Windows)
```powershell
# PowerShell or CMD
cd geo-shield
cd frontend; npm install; npm run build; cd ..
npm install
npx electron-builder --win --config electron-builder.json
```

---

### 🍎 macOS
```bash
cd geo-shield
npx electron-builder --mac --config electron-builder.json
# Output: dist-electron/GeoShield-1.0.0.dmg
```

---

## 📦 Backend Standalone (Any OS)

```bash
cd geo-shield/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Seed database
python -m app.seed_data
python -m app.seed_risk_history

# Start server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000` in any browser.

---

## 🐳 Docker

```bash
cd geo-shield
docker-compose up --build
```

---

## 🚀 One-Click Scripts

| Platform | Script | Command |
|----------|--------|---------|
| **Linux/Mac** | `deploy.sh` | `bash deploy.sh` |
| **Linux/Mac** | `demo.sh` | `./demo.sh` |
| **Linux/Mac** | `start.sh` | `./start.sh` |
| **Windows** | `start.bat` | Double-click or run in CMD |

---

## ⚠️ Prerequisites

| Requirement | Version | Where |
|-------------|---------|-------|
| Python | 3.10+ | [python.org](https://python.org/downloads) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| npm | 9+ | Comes with Node.js |

---

## 🔧 Troubleshooting

### "Port 8000 already in use"
```bash
pkill -f uvicorn  # Linux/Mac
taskkill /F /IM python.exe  # Windows
```

### "No module named 'app'"
```bash
cd geo-shield/backend
pip install -r requirements.txt
```

### "Frontend not loading in Electron"
Ensure `frontend/dist/` exists:
```bash
cd geo-shield/frontend && npm run build
```

### Windows NSIS Build Fails
Need Wine (Linux) or build on native Windows:
```bash
sudo apt install wine64  # Linux
# OR build on Windows directly
```
