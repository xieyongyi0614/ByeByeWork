import { forwardRef, memo, useImperativeHandle, useState, useCallback, useMemo } from 'react';
import styles from '../styles/rotate-card.module.scss';

interface PropsWithCardData {
  prev: string;
  next: string;
}
export interface ClockCardRef {
  init: (cardData: PropsWithCardData) => void;
  startDown: (cardData: PropsWithCardData) => void;
}

export interface ClockCardProps {
  width?: number;
  height?: number;
  defaultData?: Partial<PropsWithCardData>;
}
const ClockCard = forwardRef<ClockCardRef, ClockCardProps>((props, ref) => {
  const { width = 50, height = 80, defaultData = { prev: '0', next: '1' } } = props;
  const [data, setData] = useState({
    prev: defaultData.prev,
    next: defaultData.next,
    working: false,
  });
  const rotateCardStyle = useMemo(() => {
    return {
      '--prev-content': `'${data.prev}'`,
      '--next-content': `'${data.next}'`,
      '--clock-width': `${width}px`,
      '--clock-height': `${height}px`,
    } as React.CSSProperties;
  }, [data.prev, data.next, width, height]);
  const init = useCallback((cardData: PropsWithCardData) => {
    setData({ prev: cardData.prev, next: cardData.next, working: false });
  }, []);
  const startDown = useCallback(
    (cardData: PropsWithCardData) => {
      if (data.working) return;
      setData({ prev: cardData.prev, next: cardData.next, working: true });
      setTimeout(() => {
        setData({ prev: cardData.next, next: cardData.next, working: false });
      }, 700);
    },
    [data.working],
  );

  useImperativeHandle(ref, () => {
    return {
      init,
      startDown,
    };
  }, [init, startDown]);
  return (
    <div
      className={`${styles['rotate-card']} ${data.working ? styles.down : ''}`}
      style={rotateCardStyle}
    >
      <div className={[styles.default, styles.front].join(' ')}></div>
      <div className={[styles.default, styles.back].join(' ')}></div>
    </div>
  );
});

export default memo(ClockCard);
