const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

let mainWindow;
let backendProcess = null;
const BACKEND_PORT = 8000;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

// ==================== BACKEND MANAGEMENT ====================

function findPython() {
  const candidates = ['python3', 'python', '/usr/bin/python3', '/usr/bin/python'];
  for (const cmd of candidates) {
    try {
      const { execSync } = require('child_process');
      execSync(`${cmd} --version`, { stdio: 'ignore' });
      return cmd;
    } catch {}
  }
  return null;
}

function findBackendDir() {
  // In packaged app, backend is bundled in resources
  const possiblePaths = [
    path.join(process.resourcesPath, 'backend'),
    path.join(__dirname, '..', 'backend'),
    path.join(app.getAppPath(), 'backend'),
    path.join(app.getPath('home'), '.geoshield', 'backend'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(path.join(p, 'app', 'main.py'))) {
      return p;
    }
  }
  return null;
}

function checkBackendReady() {
  return new Promise((resolve) => {
    http.get(`${BACKEND_URL}/api/health`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.status === 'healthy');
        } catch {
          resolve(false);
        }
      });
    }).on('error', () => resolve(false));
  });
}

async function waitForBackend(maxWaitMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    if (await checkBackendReady()) return true;
    await new Promise(r => setTimeout(r, 500));
  }
  return false;
}

function startBackend() {
  const python = findPython();
  if (!python) {
    console.error('Python not found. Backend will not start.');
    return false;
  }

  const backendDir = findBackendDir();
  if (!backendDir) {
    console.error('Backend directory not found. Starting without backend.');
    return false;
  }

  console.log(`Starting backend from ${backendDir} with ${python}`);

  // Start uvicorn
  backendProcess = spawn(python, [
    '-m', 'uvicorn', 'app.main:app',
    '--host', '127.0.0.1',
    '--port', String(BACKEND_PORT),
    '--log-level', 'warning',
  ], {
    cwd: backendDir,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PYTHONUNBUFFERED: '1' },
  });

  backendProcess.stdout?.on('data', (data) => {
    console.log(`[Backend] ${data.toString().trim()}`);
  });

  backendProcess.stderr?.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg && !msg.includes('WARNING')) {
      console.log(`[Backend] ${msg}`);
    }
  });

  backendProcess.on('error', (err) => {
    console.error('Backend process error:', err.message);
  });

  backendProcess.on('exit', (code) => {
    console.log(`Backend exited with code ${code}`);
    backendProcess = null;
  });

  return true;
}

function stopBackend() {
  if (backendProcess) {
    console.log('Stopping backend...');
    try {
      backendProcess.kill('SIGTERM');
      setTimeout(() => {
        if (backendProcess) {
          backendProcess.kill('SIGKILL');
        }
      }, 3000);
    } catch {}
    backendProcess = null;
  }
}

// ==================== LOADING SCREEN ====================

function createLoadingWindow() {
  const loadingWin = new BrowserWindow({
    width: 500,
    height: 350,
    frame: false,
    transparent: true,
    resizable: false,
    center: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const loadingHTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #0a0f1a 0%, #0d1117 50%, #0a1628 100%);
      display: flex; align-items: center; justify-content: center;
      height: 100vh; color: white; overflow: hidden;
      border-radius: 16px; border: 1px solid rgba(34, 197, 94, 0.2);
    }
    .container { text-align: center; padding: 40px; }
    .shield {
      width: 80px; height: 80px; margin: 0 auto 24px;
      background: linear-gradient(135deg, #22c55e, #10b981);
      border-radius: 20px; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 40px rgba(34, 197, 94, 0.3);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(34, 197, 94, 0.3); }
      50% { transform: scale(1.05); box-shadow: 0 0 60px rgba(34, 197, 94, 0.5); }
    }
    .shield svg { width: 44px; height: 44px; fill: white; }
    h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px;
      background: linear-gradient(135deg, #fff, #a3e635);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { font-size: 12px; color: #6b7280; margin-bottom: 32px; letter-spacing: 2px; }
    .status { font-size: 13px; color: #22c55e; margin-bottom: 16px; }
    .spinner-wrap { display: flex; justify-content: center; gap: 6px; }
    .spinner-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #22c55e; animation: bounce 1.4s ease-in-out infinite;
    }
    .spinner-dot:nth-child(1) { animation-delay: 0s; }
    .spinner-dot:nth-child(2) { animation-delay: 0.16s; }
    .spinner-dot:nth-child(3) { animation-delay: 0.32s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
      40% { transform: scale(1); opacity: 1; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="shield">
      <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 9.06-7 10.2-3.87-1.14-7-5.53-7-10.2V6.3l7-3.12z"/></svg>
    </div>
    <h1>GeoShield</h1>
    <div class="subtitle">AI LANDSLIDE MONITORING</div>
    <div class="status" id="status">Initializing AI Engine...</div>
    <div class="spinner-wrap">
      <div class="spinner-dot"></div>
      <div class="spinner-dot"></div>
      <div class="spinner-dot"></div>
    </div>
  </div>
  <script>
    const msgs = [
      'Initializing AI Engine...', 'Loading ML Models...',
      'Connecting Sensors...', 'Starting Dashboard...',
      'Almost Ready...'
    ];
    let i = 0;
    const el = document.getElementById('status');
    setInterval(() => { i = (i + 1) % msgs.length; el.textContent = msgs[i]; }, 1500);
  </script>
</body>
</html>`;

  loadingWin.loadURL(`data:text/html,${encodeURIComponent(loadingHTML)}`);
  return loadingWin;
}

// ==================== MAIN WINDOW ====================

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    icon: path.join(__dirname, '..', 'branding', 'team_logo.png'),
    title: 'GeoShield — AI Landslide Early Warning System',
    show: false,
    backgroundColor: '#0a0f1a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the frontend — use HashRouter so #/map, #/alerts etc. work from file://
  const indexPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
  mainWindow.loadFile(indexPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // ==================== APPLICATION MENU ====================
  const menu = Menu.buildFromTemplate([
    {
      label: 'GeoShield',
      submenu: [
        { label: 'About GeoShield', click: () => showAbout() },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
      ],
    },
    {
      label: 'Navigate',
      submenu: [
        { label: 'Dashboard', accelerator: 'CmdOrCtrl+1', click: () => navigateTo('/') },
        { label: 'Risk Map', accelerator: 'CmdOrCtrl+2', click: () => navigateTo('/map') },
        { label: 'Alerts', accelerator: 'CmdOrCtrl+3', click: () => navigateTo('/alerts') },
        { label: 'Simulator', accelerator: 'CmdOrCtrl+4', click: () => navigateTo('/simulator') },
        { label: 'Satellite Data', accelerator: 'CmdOrCtrl+5', click: () => navigateTo('/satellite') },
        { label: 'Flood Risk', accelerator: 'CmdOrCtrl+6', click: () => navigateTo('/flood') },
        { label: 'Reports', accelerator: 'CmdOrCtrl+7', click: () => navigateTo('/reports') },
        { type: 'separator' },
        { label: 'Demo Flow', accelerator: 'CmdOrCtrl+D', click: () => navigateTo('/demo') },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => mainWindow?.reload() },
        { label: 'DevTools', accelerator: 'F12', click: () => mainWindow?.webContents.toggleDevTools() },
        { type: 'separator' },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+=', click: () => zoom(0.1) },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', click: () => zoom(-0.1) },
        { label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0', click: () => zoom(0, true) },
        { type: 'separator' },
        { label: 'Fullscreen', accelerator: 'F11', click: () => mainWindow?.setFullScreen(!mainWindow?.isFullScreen()) },
      ],
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Documentation', click: () => shell.openExternal('https://github.com/officialarghya29/GeoShield') },
        { label: 'Report Issue', click: () => shell.openExternal('https://github.com/officialarghya29/GeoShield/issues') },
        { type: 'separator' },
        { label: 'SIH 2026', click: () => shell.openExternal('https://sih.gov.in') },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);
}

function navigateTo(hash) {
  if (mainWindow) {
    mainWindow.webContents.executeJavaScript(`window.location.hash = '${hash}'`);
  }
}

function zoom(delta, reset = false) {
  if (mainWindow) {
    if (reset) {
      mainWindow.webContents.setZoomLevel(0);
    } else {
      mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() + delta);
    }
  }
}

function showAbout() {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'About GeoShield',
    message: 'GeoShield v1.0.0',
    detail: 'AI-Based Early Warning & Landslide Risk Monitoring System\nfor North Eastern Region, India\n\nSmart India Hackathon 2026\n\n© Team GeoShield',
    buttons: ['OK'],
  });
}

// ==================== IPC HANDLERS ====================

ipcMain.handle('get-backend-status', async () => {
  return await checkBackendReady();
});

ipcMain.handle('get-server-url', () => {
  return BACKEND_URL;
});

// ==================== APP LIFECYCLE ====================

app.whenReady().then(async () => {
  // Show loading screen
  const loadingWin = createLoadingWindow();

  // Start backend
  const backendStarted = startBackend();

  if (backendStarted) {
    // Wait for backend to be ready
    const ready = await waitForBackend(20000);
    if (!ready) {
      console.warn('Backend did not become ready within 20s, starting UI anyway');
    }
  }

  // Create main window
  createMainWindow();

  // Close loading screen
  setTimeout(() => {
    if (loadingWin && !loadingWin.isDestroyed()) {
      loadingWin.close();
    }
  }, 1000);
});

app.on('window-all-closed', () => {
  stopBackend();
  app.quit();
});

app.on('before-quit', () => {
  stopBackend();
});

app.on('activate', () => {
  if (mainWindow === null) createMainWindow();
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
