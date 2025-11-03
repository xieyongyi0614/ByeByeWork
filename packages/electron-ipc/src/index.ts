import { BrowserWindow, ipcMain } from 'electron';
import { AzCustomWindowMove } from './utils/windowMove';

const CustomWindowMove = new AzCustomWindowMove();

// 窗口操作处理器
ipcMain.on('Main_Window_Operate', (event, info) => {
  const operateEvent = info.event || '';
  switch (operateEvent) {
    case 'homeDragWindowStart':
      {
        /*
            如果别的窗口也想复用这个自定义拖拽方法可以这么用;
            const webContents = event.sender;
            const win = BrowserWindow.fromWebContents(webContents);
            CustomWindowMove.init(win);
            CustomWindowMove.start();
        */
        CustomWindowMove.start();
      }
      break;
    case 'homeDragWindowEnd':
      {
        CustomWindowMove.end();
      }
      break;

    default:
      break;
  }
});
ipcMain.handle('get-window-size', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) {
    return;
  }
  const [currentWidth, currentHeight] = win.getSize();
  return { width: currentWidth, height: currentHeight };
});

ipcMain.on('resize-window', (event, info) => {
  const { width, height } = info;
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) {
    return;
  }
  win.setBounds({ x: win.getBounds().x, y: win.getBounds().y, width, height });
});

export { CustomWindowMove };
