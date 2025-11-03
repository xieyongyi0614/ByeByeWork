import { app, BrowserWindow } from 'electron';
import path from 'node:path';

export const createSettingWindow = () => {
  const settingWindow = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });

  if (app.isPackaged) {
    const distPath = path.join(__dirname, '../renderer/index.html?windowType=setting');
    settingWindow.loadFile(distPath);
    return;
  }

  settingWindow.loadURL(process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL ?? 'http://localhost:2999');
  settingWindow.webContents.openDevTools();
};
