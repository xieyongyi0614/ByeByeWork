import { ipcMain } from 'electron';
import { AzCustomWindowMove } from './utils/wIndowMove';

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

export { CustomWindowMove };
