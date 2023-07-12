import { Maybe } from '@carrier-io/lynx-fleet-types';
import { AuthState } from '@okta/okta-auth-js';

export const getOktaUserEmail = (authState: Maybe<AuthState>): string => {
  const email = authState?.idToken?.claims?.email || authState?.idToken?.claims?.sub;

  return email?.toLowerCase() || '';
};
