// Electron API 类型定义
declare global {
  interface Window {
    electronAPI?: {
      publishMainWindowOperateMessage: (info: { event: string }) => void;
      getWindowSize: () => Promise<{ width: number; height: number }>;
      resizeWindow: (info: { width: number; height: number }) => void;
    };
  }
}

export {};
