import { useState, useEffect, useRef, useCallback } from 'react';

interface Options {
  interval?: number;
  immediate?: boolean;
}

/**
 * 获取当前时间
 */
export const useNowTime = ({ interval = 1000, immediate = false }: Options = {}): [
  number,
  () => void,
  boolean,
] => {
  const [nowTime, setNowTime] = useState(new Date().getTime());
  const [running, setRunning] = useState(true);
  const intervalRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!running) return;

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
  }, [interval, immediate, running]);

  return [nowTime, stop, running];
};
