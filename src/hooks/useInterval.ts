import { useEffect, useRef } from 'react';

export const useInterval = (callback: Function, delay?: number | null) => {
  const savedCallback = useRef<Function>(() => {});

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    tick();

    if (delay !== null) {
      const interval = setInterval(tick, delay || 0);

      return () => clearInterval(interval);
    }

    return undefined;
  }, [delay]);
};
