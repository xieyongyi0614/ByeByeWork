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
  const clockContainerRef = useRef<HTMLDivElement>(null)

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

  const handleMouseUp = useCallback(() => {
    window.electronAPI?.publishMainWindowOperateMessage({
      event: 'homeDragWindowEnd',
    })
  }, [])
  const handleMouseDown = useCallback(() => {
    window.electronAPI?.publishMainWindowOperateMessage({
      event: 'homeDragWindowStart',
    })
    document.onmouseup = function () {
      document.onmousemove = null
      document.onmouseup = null
      document.onselectstart = null
      window.electronAPI?.publishMainWindowOperateMessage({
        event: 'homeDragWindowEnd',
      })
    }
  }, [])
  return (
    <div
      ref={clockContainerRef}
      className={styles.container}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {clockRefs.current.map((ref, index) => (
        <ClockCard key={index} ref={ref} />
      ))}
    </div>
  )
}
export default CountDown
