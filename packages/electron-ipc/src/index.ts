import { ipcMain, IpcMainInvokeEvent, BrowserWindow } from 'electron'

// 示例：处理窗口移动请求
ipcMain.handle(
  'move-window',
  (event: IpcMainInvokeEvent, x: number, y: number) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      win.setPosition(x, y)
    }
  }
)
