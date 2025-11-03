import React, { useEffect, useRef, useCallback, useMemo, memo, useState } from 'react';
import { useNowTime } from '@/hooks/useNowTime';
import dayjs from 'dayjs';
import ClockCard, { type ClockCardRef } from './widgets/RotateCard';
import styles from './styles/rotate-card.module.scss';

const CountDown = () => {
  const [nowTime] = useNowTime();
  const [clockCardSize, setClockCardSize] = useState({ width: 50, height: 80 });

  const clockRefs = useRef<Array<React.RefObject<ClockCardRef | null>>>(
    Array.from({ length: 6 }, () => React.createRef<ClockCardRef>()),
  );
  const clockContainerRef = useRef<HTMLDivElement>(null);

  const timeDigits = useMemo(() => {
    const currentTime = dayjs(nowTime).format('HHmmss').split('');
    const nextTime = dayjs(nowTime + 1000)
      .format('HHmmss')
      .split('');
    return { current: currentTime, next: nextTime };
  }, [nowTime]);

  useEffect(() => {
    const { current, next } = timeDigits;

    current.forEach((currentDigit, index) => {
      const nextDigit = next[index];
      const clockRef = clockRefs.current[index];

      if (!clockRef?.current) return;

      if (currentDigit === nextDigit) {
        clockRef.current?.init?.({
          prev: currentDigit,
          next: nextDigit,
        });
      } else {
        clockRef.current.startDown({
          prev: currentDigit,
          next: nextDigit,
        });
      }
    });
  }, [timeDigits]);

  const handleMouseUp = useCallback(() => {
    console.log('handleMouseUp');
    window.electronAPI?.publishMainWindowOperateMessage({
      event: 'homeDragWindowEnd',
    });
  }, []);
  const handleMouseDown = useCallback(() => {
    console.log('handleMouseDown');
    window.electronAPI?.publishMainWindowOperateMessage({
      event: 'homeDragWindowStart',
    });
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
      document.onselectstart = null;
      window.electronAPI?.publishMainWindowOperateMessage({
        event: 'homeDragWindowEnd',
      });
    };
  }, []);
  const handleWheel = useCallback(async (event: React.WheelEvent<HTMLDivElement>) => {
    const { width, height } = (await window.electronAPI?.getWindowSize()) || {
      width: 300,
      height: 80,
    };
    const scaleFactor = 1.1;

    const size = { width, height };

    if (event.deltaY < 0) {
      size.width = parseInt((size.width * scaleFactor).toString());
      size.height = parseInt((size.height * scaleFactor).toString());
    } else {
      size.width = parseInt((size.width / scaleFactor).toString());
      size.height = parseInt((size.height / scaleFactor).toString());
    }

    setClockCardSize((p) => ({
      ...p,
      width: parseInt((size.width / 6).toString()),
      height: size.height,
    }));
    window.electronAPI?.resizeWindow(size);
  }, []);
  return (
    <div
      ref={clockContainerRef}
      className={styles.container}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {clockRefs.current.map((ref, index) => (
        <ClockCard key={index} ref={ref} {...clockCardSize} />
      ))}
    </div>
  );
};
export default memo(CountDown);
