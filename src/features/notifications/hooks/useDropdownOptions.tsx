import { useCallback, useState } from 'react';

export function useDropdownOption<T>(initialValue: T) {
  const [option, setOption] = useState<T>(initialValue);

  const handleOptionChange = useCallback((newOption: T) => {
    setOption(newOption);
  }, []);

  return {
    option,
    handleOptionChange,
  };
}
