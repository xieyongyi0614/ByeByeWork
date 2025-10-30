// Electron API 类型定义
declare global {
  interface Window {
    electronAPI?: {
      moveWindow: (x: number, y: number) => Promise<void>
      publishMainWindowOperateMessage: (info: { event: string }) => void
    }
  }
}

export {}
