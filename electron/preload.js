// Electron preload script - secure bridge between renderer and main process
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getBackendStatus: () => ipcRenderer.invoke('get-backend-status'),
  getServerUrl: () => ipcRenderer.invoke('get-server-url'),
  isElectron: true,
  platform: process.platform,
  version: process.env.npm_package_version || '1.0.0',
});
