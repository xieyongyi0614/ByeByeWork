import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { CustomWindowMove } from '@repo/electron-ipc';

export const createClockWindow = () => {
  const clockWindow = new BrowserWindow({
    width: 300,
    height: 80,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
    frame: false,
    transparent: true,
    alwaysOnTop: true,
  });

  CustomWindowMove.init(clockWindow);

  if (app.isPackaged) {
    const distPath = path.join(__dirname, '../renderer/index.html?windowType=clock');
    clockWindow.loadFile(distPath);
    return;
  }

  clockWindow.loadURL(process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL ?? 'http://localhost:2999');
  clockWindow.webContents.openDevTools();
};
