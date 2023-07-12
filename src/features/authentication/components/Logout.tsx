import { useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';

import { SplashScreen } from '@/components/SplashScreen';

export const Logout = () => {
  const { oktaAuth } = useOktaAuth();

  useEffect(() => {
    oktaAuth.signOut().then(() => {
      sessionStorage.clear();
    });
  });

  return <SplashScreen />;
};
