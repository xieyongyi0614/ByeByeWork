import { app, BrowserWindow } from 'electron';
import path from 'node:path';

export const createSettingWindow = () => {
  const settingWindow = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });

  if (app.isPackaged) {
    // const distPath = path.join(__dirname, '../renderer/index.html?windowType=setting');
    // settingWindow.loadFile(distPath);
    const filePath = path.join(__dirname, '../renderer/index.html');
    const url = new URL(filePath, 'file://');
    url.searchParams.append('windowType', 'setting');
    settingWindow.loadURL(url.toString());
  } else {
    settingWindow.loadURL('http://localhost:2999?windowType=setting');
    settingWindow.webContents.openDevTools();
  }
  settingWindow.on('close', (event) => {
    if (settingWindow) {
      event.preventDefault();
      settingWindow.hide();
    }
  });
  return settingWindow;
};
