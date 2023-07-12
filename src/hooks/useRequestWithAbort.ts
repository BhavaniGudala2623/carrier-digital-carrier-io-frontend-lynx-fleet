import { useState, useEffect } from 'react';
import { Maybe } from '@carrier-io/lynx-fleet-types';

interface UseFetchWithAbortResponse {
  data: unknown;
  isLoading: boolean;
  error: Maybe<Error>;
}

interface UseFetchWithAbortArgs {
  callback: (args: unknown) => unknown;
  args?: unknown;
  errorMessage?: string;
}

export const useFetchWithAbort = ({
  callback,
  args,
  errorMessage = '',
}: UseFetchWithAbortArgs): UseFetchWithAbortResponse => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Maybe<Error>>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await callback({
          ...(args || {}),
          signal: abortController.signal,
        });

        setIsLoading(false);
        setData(response as []);
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') {
          setError(err as Error);
        } else {
          setError(err as Error);
          throw new Error(`${errorMessage} ${err}`);
        }
      }
    };

    fetchData().finally(() => setIsLoading(false));

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, args, errorMessage]);

  return { data, isLoading, error };
};
