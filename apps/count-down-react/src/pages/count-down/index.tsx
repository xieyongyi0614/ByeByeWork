import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { useNowTime } from '@/hooks/useNowTime'
import dayjs from 'dayjs'
import ClockCard, { type ClockCardRef } from './widgets/RotateCard'
import styles from './styles/rotate-card.module.scss'

const CountDown = () => {
  const [nowTime] = useNowTime()

  const clockRefs = useRef<Array<React.RefObject<ClockCardRef | null>>>(
    Array.from({ length: 6 }, () => React.createRef<ClockCardRef>())
  )

  const timeDigits = useMemo(() => {
    const currentTime = dayjs(nowTime).format('HHmmss').split('')
    const nextTime = dayjs(nowTime + 1000)
      .format('HHmmss')
      .split('')
    return { current: currentTime, next: nextTime }
  }, [nowTime])

  useEffect(() => {
    const { current, next } = timeDigits

    current.forEach((currentDigit, index) => {
      const nextDigit = next[index]
      const clockRef = clockRefs.current[index]

      if (!clockRef?.current) return

      if (currentDigit === nextDigit) {
        clockRef.current?.init?.({
          prev: currentDigit,
          next: nextDigit,
        })
      } else {
        clockRef.current.startDown({
          prev: currentDigit,
          next: nextDigit,
        })
      }
    })
  }, [timeDigits])

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { x, y } = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - x
    const offsetY = e.clientY - y

    const dragMove = (e: MouseEvent) => {
      // 通过Electron API移动窗口，而不是使用 window.moveTo
      if (window.electronAPI?.moveWindow) {
        window.electronAPI.moveWindow(e.screenX - offsetX, e.screenY - offsetY)
      } else {
        // 降级处理：在非Electron环境中使用原生API
        console.warn('electronAPI not available, using fallback')
      }
    }

    const dragEnd = () => {
      window.removeEventListener('mousemove', dragMove)
      window.removeEventListener('mouseup', dragEnd)
    }

    window.addEventListener('mousemove', dragMove)
    window.addEventListener('mouseup', dragEnd)
  }, [])

  return (
    <div className={styles.container} onMouseDown={handleDragStart}>
      {clockRefs.current.map((ref, index) => (
        <ClockCard key={index} ref={ref} />
      ))}
    </div>
  )
}
export default CountDown
