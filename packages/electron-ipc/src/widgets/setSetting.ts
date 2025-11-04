import { ipcMain } from 'electron';
import { getWindow } from '../utils/windowRegistry';

ipcMain.on('set-setting', (event, info) => {
  const { setting } = info;

  // 从窗口注册表中获取 clockWindow
  const clockWindow = getWindow('clock');

  if (!clockWindow) {
    return;
  }

  // 向 clockWindow 发送设置数据
  clockWindow.webContents.send('setting-updated', setting);
});
