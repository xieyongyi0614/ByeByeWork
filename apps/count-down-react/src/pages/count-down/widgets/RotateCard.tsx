import {
  forwardRef,
  memo,
  useImperativeHandle,
  useState,
  useCallback,
} from 'react'
import styles from '../styles/rotate-card.module.scss'

interface PropsWithCardData {
  prev: string
  next: string
}
export interface ClockCardRef {
  init: (cardData: PropsWithCardData) => void
  startDown: (cardData: PropsWithCardData) => void
}

const ClockCard = forwardRef<ClockCardRef>((_props, ref) => {
  const [data, setData] = useState({
    prev: '0',
    next: '1',
    working: false,
  })
  const init = useCallback((cardData: PropsWithCardData) => {
    setData({ prev: cardData.prev, next: cardData.next, working: false })
  }, [])
  const startDown = useCallback(
    (cardData: PropsWithCardData) => {
      if (data.working) return
      setData({ prev: cardData.prev, next: cardData.next, working: true })
      setTimeout(() => {
        setData({ prev: cardData.next, next: cardData.next, working: false })
      }, 600)
    },
    [data.working]
  )
  useImperativeHandle(ref, () => {
    return {
      init,
      startDown,
    }
  }, [init, startDown])
  return (
    <div
      className={`${styles['rotate-card']} ${data.working ? styles.down : ''}`}
      style={
        {
          '--prev-content': `'${data.prev}'`,
          '--next-content': `'${data.next}'`,
        } as React.CSSProperties
      }
    >
      <div className={[styles.default, styles.front].join(' ')}></div>
      <div className={[styles.default, styles.back].join(' ')}></div>
    </div>
  )
})

export default memo(ClockCard)
