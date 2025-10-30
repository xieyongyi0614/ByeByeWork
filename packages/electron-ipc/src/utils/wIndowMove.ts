import { BrowserWindow, screen } from 'electron'
export class AzCustomWindowMove {
  isOpen: boolean
  win: BrowserWindow | null = null
  winStartPosition: {
    x: number
    y: number
    width: number
    height: number
  }
  startPosition: {
    x: number
    y: number
  }
  constructor() {
    this.isOpen = false
    this.win = null
    this.winStartPosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }
    this.startPosition = {
      x: 0,
      y: 0,
    }
  }
  init(win: BrowserWindow | null) {
    this.win = win
  }
  start() {
    if (!this.win) {
      return
    }
    this.isOpen = true
    const winPosition = this.win.getPosition()
    const winSize = this.win.getSize()
    this.winStartPosition.x = winPosition[0] as number
    this.winStartPosition.y = winPosition[1] as number
    this.winStartPosition.width = winSize[0] as number
    this.winStartPosition.height = winSize[1] as number

    const mouseStartPosition = screen.getCursorScreenPoint()
    this.startPosition.x = mouseStartPosition.x
    this.startPosition.y = mouseStartPosition.y

    this.move()
  }
  move() {
    if (!this.isOpen || !this.win) {
      return
    }
    console.log(
      'this.win.isDestroyed()',
      this.win.isDestroyed(),
      this.win.isFocused()
    )
    if (this.win.isDestroyed()) {
      this.end()
      return
    }
    if (!this.win.isFocused()) {
      this.end()
      return
    }
    const cursorPosition = screen.getCursorScreenPoint()

    const x = this.winStartPosition.x + cursorPosition.x - this.startPosition.x
    const y = this.winStartPosition.y + cursorPosition.y - this.startPosition.y

    // this.win.setPosition(120, 120, false);
    // this.win.setBounds({x: 120, y: 120})

    this.win.setBounds({
      x: x,
      y: y,
      width: this.winStartPosition.width,
      height: this.winStartPosition.height,
    })
    setTimeout(() => {
      this.move()
    }, 20)
  }
  end() {
    this.isOpen = false
  }
}
