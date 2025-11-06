import React, { useEffect, useRef, useCallback, useMemo, memo, useState } from 'react';
import { useNowTime } from '@/hooks/useNowTime';
import dayjs from 'dayjs';
import ClockCard, { type ClockCardRef } from './widgets/RotateCard';
import styles from './styles/rotate-card.module.scss';
import { useTimeDifference } from '@/hooks/useTimeDifference';

interface SettingData {
  byeWordTime: string | null;
}

const CountDown = () => {
  const [nowTime] = useNowTime();

  const [clockCardSize, setClockCardSize] = useState({ width: 50, height: 80 });
  const [setting, setSetting] = useState<SettingData | null>(null);

  const [timeDifference] = useTimeDifference(setting?.byeWordTime || null, {
    interval: 1000,
    immediate: true,
  });
  const clockRefs = useRef<Array<React.RefObject<ClockCardRef | null>>>(
    Array.from({ length: 6 }, () => React.createRef<ClockCardRef>()),
  );
  const clockContainerRef = useRef<HTMLDivElement>(null);

  const timeDigits = useMemo(() => {
    if (setting?.byeWordTime) {
      // 将毫秒数转换为时分秒
      const formatTimeFromMs = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        // 格式化为 HHmmss，补零
        const hoursStr = String(hours).padStart(2, '0');
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(seconds).padStart(2, '0');
        return (hoursStr + minutesStr + secondsStr).split('');
      };

      const currentTime = formatTimeFromMs(timeDifference);
      const nextTime = formatTimeFromMs(Math.max(0, timeDifference - 1000));
      return { current: currentTime, next: nextTime };
    }
    const currentTime = dayjs(nowTime).format('HHmmss').split('');
    const nextTime = dayjs(nowTime + 1000)
      .format('HHmmss')
      .split('');
    return { current: currentTime, next: nextTime };
  }, [nowTime, setting?.byeWordTime, timeDifference]);

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
        if (index === 4) {
          console.log(currentDigit, nextDigit, 'currentDigit, nextDigit');
        }
        clockRef.current.startDown({
          prev: currentDigit,
          next: nextDigit,
        });
      }
    });
  }, [timeDigits]);

  const handleMouseUp = useCallback(() => {
    window.electronAPI?.publishMainWindowOperateMessage({
      event: 'homeDragWindowEnd',
    });
  }, []);
  const handleMouseDown = useCallback(() => {
    window.electronAPI?.publishMainWindowOperateMessage({
      event: 'homeDragWindowStart',
    });
    // document.onmouseup = function () {
    //   document.onmousemove = null;
    //   document.onmouseup = null;
    //   document.onselectstart = null;
    //   window.electronAPI?.publishMainWindowOperateMessage({
    //     event: 'homeDragWindowEnd',
    //   });
    // };
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

  // 监听设置更新
  useEffect(() => {
    const handleSettingUpdated = (newSetting: SettingData) => {
      console.log('Setting updated:', newSetting);
      setSetting(newSetting);
    };

    window.electronAPI?.onSettingUpdated(handleSettingUpdated);

    return () => {
      window.electronAPI?.removeSettingUpdatedListener();
    };
  }, []);

  // 根据设置数据更新界面
  useEffect(() => {
    if (setting?.byeWordTime) {
      // 这里可以根据 byeWordTime 设置显示逻辑
      console.log('Bye word time:', setting.byeWordTime);
    }
  }, [setting]);

  return (
    <div
      ref={clockContainerRef}
      className={styles.container}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      style={
        {
          '--clock-width': `${clockCardSize.width}px`,
          '--clock-height': `${clockCardSize.height}px`,
        } as React.CSSProperties
      }
    >
      {setting?.byeWordTime && <div className={styles['byeWord-start']}>你还有</div>}

      {clockRefs.current.map((ref, index) => (
        <ClockCard key={index} ref={ref} {...clockCardSize} />
      ))}
      {setting?.byeWordTime && <div className={styles['byeWord-end']}>下班</div>}
    </div>
  );
};
export default memo(CountDown);
