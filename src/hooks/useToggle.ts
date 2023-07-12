import { useCallback, useState } from 'react';

export const useToggle = (initialValue: boolean) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((prevValue) => !prevValue), []);

  const toggleOn = useCallback(() => setValue(true), []);

  const toggleOff = useCallback(() => setValue(false), []);

  return {
    value,
    toggle,
    toggleOn,
    toggleOff,
  };
};
