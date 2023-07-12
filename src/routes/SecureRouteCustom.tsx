import { useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import type { AppState } from '@/stores';
import { showError } from '@/stores/actions';
import { SplashScreen } from '@/components';
import { hasErrorType } from '@/utils/hasErrorType';

// Its usage should be replaced with SecureRoute from @okta/okta-react
// once they add a support for 6th version of react-router-dom
// https://github.com/okta/okta-react/issues/178#issuecomment-1070933513
export const SecureRouteCustom = ({ children }: { children: JSX.Element }) => {
  const { authState } = useOktaAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // here we should use useDispatch
  const [navigateToLogin, setNavigateToLogin] = useState(false);
  const { loading, tenant, user, error, basicPermissionsLoaded } = useSelector(
    (state: AppState) => state.auth
  ); // here we should use useSelector instead of useAppSelector

  useEffect(() => {
    if (navigateToLogin) {
      navigate('/auth/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigateToLogin]);

  useEffect(() => {
    if (!loading && error && typeof error === 'string') {
      if (hasErrorType(error, 'UNAUTHORIZED_NOT_ACCEPTED_PRIVACY_POLICY')) {
        navigate('/privacy');
      } else {
        showError(dispatch, error);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  if (!authState) {
    return null;
  }

  if (!authState.isAuthenticated) {
    if (!navigateToLogin && location.pathname !== '/auth/login') {
      setNavigateToLogin(true);
    }

    return null;
  }

  if (!loading && error) {
    return null;
  }

  if (loading || !user || !tenant || !basicPermissionsLoaded) {
    return <SplashScreen />;
  }

  return children;
};
