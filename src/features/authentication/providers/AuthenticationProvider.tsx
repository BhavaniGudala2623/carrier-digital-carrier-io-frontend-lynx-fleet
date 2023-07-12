import { useCallback, useEffect } from 'react';
import { Security } from '@okta/okta-react';
import { AuthState, OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { useNavigate } from 'react-router-dom';

import { fetchUserData } from '../stores';

import { useAppDispatch } from '@/stores/hooks';
import { getOktaUserEmail } from '@/utils';

const oktaAuth = new OktaAuth({
  issuer: process.env.REACT_APP_OKTA_ISSUER,
  clientId: process.env.REACT_APP_OKTA_CLIENTID,
  scopes: ['openid', 'email', 'profile', 'groups'],
  pkce: true,
  redirectUri: `${window.location.origin}/auth/login/callback`,
});

export const AuthenticationProvider = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const restoreOriginalUri = useCallback(
    (_oktaAuth, originalUri) => {
      navigate(toRelativeUrl(originalUri || '/', window.location.origin), { replace: true });
    },
    [navigate]
  );

  const authStateChanged = useCallback((authState: AuthState | null) => {
    if (authState?.isAuthenticated) {
      dispatch(fetchUserData(getOktaUserEmail(authState)));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { authStateManager } = oktaAuth;
    authStateManager.subscribe(authStateChanged);

    return () => authStateManager.unsubscribe(authStateChanged);
  }, [authStateChanged]);

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      {children}
    </Security>
  );
};
