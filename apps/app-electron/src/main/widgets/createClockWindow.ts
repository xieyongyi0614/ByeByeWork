import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { CustomWindowMove, registerWindow } from '@repo/electron-ipc';

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
    skipTaskbar: true,
  });

  // 注册窗口到窗口注册表
  registerWindow('clock', clockWindow);

  CustomWindowMove.init(clockWindow);

  if (app.isPackaged) {
    // const distPath = path.join(__dirname, '../renderer/index.html?windowType=clock');
    // clockWindow.loadFile(distPath);
    const filePath = path.join(__dirname, '../renderer/index.html');
    const url = new URL(filePath, 'file://');
    url.searchParams.append('windowType', 'clock');
    clockWindow.loadURL(url.toString());
  } else {
    clockWindow.loadURL('http://localhost:2999?windowType=clock');
    clockWindow.webContents.openDevTools();
  }

  return clockWindow;
};
