import { contextBridge, ipcRenderer } from 'electron';

// 定义 electronAPI 接口
const electronAPI = {
  moveWindow: (x: number, y: number) => ipcRenderer.invoke('move-window', x, y),
  publishMainWindowOperateMessage: (info: { event: string; data: {} }) => {
    ipcRenderer.send('Main_Window_Operate', info);
  },
};

// 将 electronAPI 暴露给渲染进程
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// 声明全局类型
declare global {
  interface Window {
    electronAPI?: typeof electronAPI;
  }
}
