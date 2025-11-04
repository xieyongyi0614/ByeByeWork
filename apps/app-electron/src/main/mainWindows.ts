import { BrowserWindow } from 'electron';
import { createClockWindow } from './widgets/createClockWindow';
import { createSettingWindow } from './widgets/createSettingWindow';

export class MainWindows {
  private clockWindow: BrowserWindow | null = null;
  private settingWindow: BrowserWindow | null = null;

  constructor() {}
  init() {
    this.clockWindow = createClockWindow();
    this.settingWindow = createSettingWindow();
  }
  getClockWindow() {
    return this.clockWindow;
  }
  getSettingWindow() {
    return this.settingWindow;
  }
}
