const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    icon: path.join(__dirname, '..', 'branding', 'team_logo.png'),
    title: 'GeoShield - AI Landslide Monitoring',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#0a0f1a',
    titleBarStyle: 'default',
    show: false,
  });

  // Load the built frontend
  const indexPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
  mainWindow.loadFile(indexPath);

  // Show when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Custom menu
  const menu = Menu.buildFromTemplate([
    {
      label: 'GeoShield',
      submenu: [
        { label: 'About GeoShield', click: () => shell.openExternal('https://github.com/officialarghya29/GeoShield') },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Dashboard', accelerator: 'CmdOrCtrl+1', click: () => mainWindow.loadFile(indexPath) },
        { label: 'Risk Map', accelerator: 'CmdOrCtrl+2', click: () => mainWindow.webContents.executeJavaScript("window.location.hash='/map'") },
        { label: 'Simulator', accelerator: 'CmdOrCtrl+3', click: () => mainWindow.webContents.executeJavaScript("window.location.hash='/simulator'") },
        { type: 'separator' },
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.reload() },
        { label: 'Dev Tools', accelerator: 'F12', click: () => mainWindow.webContents.toggleDevTools() },
        { type: 'separator' },
        { label: 'Fullscreen', accelerator: 'F11', click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()) },
      ],
    },
    {
      label: 'Help',
      submenu: [
        { label: 'SIH 2026 Documentation', click: () => shell.openExternal('https://github.com/officialarghya29/GeoShield/blob/main/SIH_2026_PRESENTATION.md') },
        { label: 'Report Issue', click: () => shell.openExternal('https://github.com/officialarghya29/GeoShield/issues') },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
