import { useCallback, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';

export const useLogout = () => {
  const { oktaAuth } = useOktaAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const logout = useCallback(() => {
    setLoading(true);

    oktaAuth
      .signOut()
      .then(() => {
        sessionStorage.clear();
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [oktaAuth]);

  return {
    logout,
    loading,
    error,
  };
};
