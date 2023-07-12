import { useCallback, useEffect, useRef } from 'react';

type Action = () => void;
type AttemptActionOptions = {
  times?: number;
  interval?: number;
  propogateError?: boolean;
};

export const useRepeatedAttempts = () => {
  const timers = useRef<number[]>([]);
  const attempts = useRef<Map<Action, number>>(new Map());

  /**
   * Will repeat an action if it throws an error during execution
   */
  const attemptAction = useCallback(
    (action: Action, { times = 3, interval = 150, propogateError = false }: AttemptActionOptions) => {
      const timer = window.setInterval(() => {
        const attemptsDone = attempts.current.get(action) ?? 0;

        const finishAttempts = () => {
          clearInterval(timer);
          attempts.current.delete(action);
          timers.current = timers.current.filter((item) => item !== timer);
        };

        if (attemptsDone === times) {
          finishAttempts();
        } else {
          try {
            action();
            finishAttempts();
          } catch (error) {
            attempts.current.set(action, attemptsDone + 1);
            if (propogateError) {
              throw error;
            }
          }
        }
      }, interval);

      timers.current.push(timer);
    },
    []
  );

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return { attemptAction };
};
