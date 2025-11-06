import { app, BrowserWindow, Menu, nativeImage, Tray } from 'electron';
import started from 'electron-squirrel-startup';
import dotenv from 'dotenv';
import { MainWindows } from './main/mainWindows';
import path from 'node:path';

dotenv.config();
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  const mainWindows = new MainWindows();
  mainWindows.init();

  // 根据开发/生产环境获取正确的资源路径
  let trayIconPath: string;
  if (app.isPackaged) {
    // 生产环境：资源在 extraResources 中（通过 process.resourcesPath 访问）
    trayIconPath = path.join(process.resourcesPath, 'assets', 'tray-icon.jpg');
  } else {
    trayIconPath = path.join(__dirname, '..', '..', 'src', 'assets', 'tray-icon.jpg');
  }

  const tray = new Tray(nativeImage.createFromPath(trayIconPath));

  tray.on('click', () => {
    if (mainWindows.getSettingWindow()?.isVisible()) {
      mainWindows.getSettingWindow()?.hide();
    } else {
      mainWindows.getSettingWindow()?.show();
    }
  });

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: () => {
        if (mainWindows.getSettingWindow()) {
          mainWindows.getSettingWindow()?.destroy();
        }
        app.quit();
      },
    },
  ]);
  tray.setToolTip('ByeByeWork');
  tray.setContextMenu(contextMenu);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    const mainWindows = new MainWindows();
    mainWindows.init();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
