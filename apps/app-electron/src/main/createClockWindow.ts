import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { CustomWindowMove } from '@repo/electron-ipc';

export const createClockWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 80,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false,
    },
    frame: false,
    transparent: true,
    alwaysOnTop: true,
  });

  CustomWindowMove.init(mainWindow);

  if (app.isPackaged) {
    const distPath = path.join(__dirname, '../renderer/index.html');
    mainWindow.loadFile(distPath);
    return;
  }

  mainWindow.loadURL(process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL ?? 'http://localhost:2999');
  mainWindow.webContents.openDevTools();
};
