import { useRef, useCallback, useLayoutEffect } from 'react';
// A Hook to define an event handler with an always-stable function identity.
// more details in the pr from Dan Abramov https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
export function useEvent<T extends (...args: any[]) => any>(handler: T): T {
  const handlerRef = useRef<T | null>(null);

  // In a real implementation, this would run before layout effects
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: Parameters<T>) => {
    // In a real implementation, this would throw if called during render
    const fn = handlerRef.current;

    return fn?.(...args);
  }, []) as T;
}
