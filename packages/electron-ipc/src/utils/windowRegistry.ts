import { BrowserWindow } from 'electron';

// 窗口注册表：用于存储不同类型的窗口引用
const windowRegistry = new Map<string, BrowserWindow>();

export const registerWindow = (windowType: string, window: BrowserWindow) => {
  windowRegistry.set(windowType, window);
  // 窗口关闭时自动清理
  window.on('closed', () => {
    windowRegistry.delete(windowType);
  });
};

export const getWindow = (windowType: string): BrowserWindow | undefined => {
  const window = windowRegistry.get(windowType);
  if (window && window.isDestroyed()) {
    windowRegistry.delete(windowType);
    return undefined;
  }
  return window;
};
