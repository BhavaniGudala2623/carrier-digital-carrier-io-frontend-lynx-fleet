import { FC } from 'react';
import { IntercomProps, IntercomProvider as Provider, useIntercom } from 'react-use-intercom';
import { useOktaAuth } from '@okta/okta-react'; // TODO: get rid of this reference

const INTERCOM_ID = process.env.REACT_APP_INTERCOM_ID;

const IntercomBoot: FC = () => {
  const { authState } = useOktaAuth();
  const { boot } = useIntercom();

  // boot the chat if the user is logged in
  if (INTERCOM_ID !== '') {
    if (authState?.idToken?.claims) {
      try {
        const { name, email } = authState.idToken.claims;

        boot({
          name,
          email,
          date: new Date().toISOString(),
          customLauncherSelector: '#intercomButton',
          hideDefaultLauncher: true,
        } as IntercomProps);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`Unable to start intercom chat: ${error}`);
      }
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn('Unable to initialize intercom chat: REACT_APP_INTERCOM_ID is not set');
  }

  return null;
};

export const IntercomProvider: FC<{ children: JSX.Element }> = ({ children }) => (
  // Intercom currently depends on authentication
  // (it needs it in order to pull user's name and email)

  <Provider appId={INTERCOM_ID || ''}>
    <IntercomBoot />
    {children}
  </Provider>
);
