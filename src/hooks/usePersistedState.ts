import { useEffect, useState } from 'react';

export const makeUsePersistedState =
  (storage: Storage) =>
  <T>(initialValue: T, storageKey: string) => {
    const [state, setState] = useState<T>(() => {
      try {
        const storageValue = storage.getItem(storageKey);

        return storageValue ? JSON.parse(storageValue) : initialValue;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Error while parsing persisted state', error);

        return initialValue;
      }
    });

    useEffect(() => {
      storage.setItem(storageKey, JSON.stringify(state));
    }, [storageKey, state]);

    return [state, setState] as const;
  };

export const useLocalPersistedState = makeUsePersistedState(localStorage);
export const useSessionPersistedState = makeUsePersistedState(sessionStorage);
