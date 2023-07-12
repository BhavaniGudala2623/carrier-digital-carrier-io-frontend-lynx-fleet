import { useCallback, useState } from 'react';

export function useNumericValue(initialValue: number, onChange?: (value: number) => void) {
  const [value, setValue] = useState<number>(initialValue);

  const handleValueChange = useCallback(
    (newValue: number) => {
      setValue(newValue || 0);

      if (onChange) {
        onChange(newValue || 0);
      }
    },
    [onChange]
  );

  return {
    value,
    handleValueChange,
  };
}
