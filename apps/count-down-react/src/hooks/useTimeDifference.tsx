import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';

interface Options {
  interval?: number;
  immediate?: boolean;
}

/**
 * 计算从当前时间到目标时间的差距
 * @param targetTime 目标时间，格式为 "HH:mm:ss" 或 dayjs 对象
 * @param options 配置选项
 * @returns [差距（毫秒）, 停止函数, 是否运行中, 是否已过期]
 */
export const useTimeDifference = (
  targetTime: string | dayjs.Dayjs | null,
  { interval = 1000, immediate = false }: Options = {},
): [number, () => void, boolean, boolean] => {
  const [nowTime, setNowTime] = useState(new Date().getTime());
  const [running, setRunning] = useState(true);
  const intervalRef = useRef<number | null>(null);

  // 计算目标时间的时间戳
  const targetTimestamp = useMemo(() => {
    if (!targetTime) return null;

    let target: dayjs.Dayjs;
    if (typeof targetTime === 'string') {
      // 解析时间字符串 "HH:mm:ss"
      const [hours, minutes, seconds] = targetTime.split(':').map(Number);
      target = dayjs().hour(hours).minute(minutes).second(seconds).millisecond(0);
    } else {
      target = dayjs(targetTime);
    }

    // 如果目标时间已经过了今天，则设置为明天
    if (target.isBefore(dayjs())) {
      target = target.add(1, 'day');
    }

    return target.valueOf();
  }, [targetTime]);

  // 计算差距
  const difference = useMemo(() => {
    if (!targetTimestamp) return 0;
    return Math.max(0, targetTimestamp - nowTime);
  }, [targetTimestamp, nowTime]);

  // 判断是否已过期
  const isExpired = useMemo(() => {
    if (!targetTimestamp) return false;
    return nowTime >= targetTimestamp;
  }, [targetTimestamp, nowTime]);

  const stop = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!running || !targetTime) return;

    const updateTime = () => setNowTime(new Date().getTime());

    if (immediate) {
      updateTime();
    }

    intervalRef.current = setInterval(updateTime, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [interval, immediate, running, targetTime]);

  return [difference, stop, running, isExpired];
};
