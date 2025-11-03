import { contextBridge, ipcRenderer } from 'electron';

// 定义 electronAPI 接口
const electronAPI = {
  publishMainWindowOperateMessage: (info: { event: string }) => {
    ipcRenderer.send('Main_Window_Operate', info);
  },
  getWindowSize: () => {
    return ipcRenderer.invoke('get-window-size');
  },
  resizeWindow: (info: { width: number; height: number }) => {
    ipcRenderer.send('resize-window', info);
  },
};

// 将 electronAPI 暴露给渲染进程
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// // 声明全局类型
// declare global {
//   interface Window {
//     electronAPI?: typeof electronAPI;
//   }
// }
