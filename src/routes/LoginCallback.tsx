import { useOktaAuth } from '@okta/okta-react';
import { ComponentType, FC, ReactElement, useEffect, useState } from 'react';

interface LoginCallbackProps {
  errorComponent?: ComponentType<{ error: Error }>;
  onAuthResume?: () => void;
  loadingElement?: ReactElement;
}

// Its usage should be replaced with LoginCallback from @okta/okta-react
// once they add a support for 6th version of react-router-dom
// https://github.com/okta/okta-react/issues/178#issuecomment-1070933513
export const LoginCallback: FC<LoginCallbackProps> = ({
  errorComponent,
  loadingElement = null,
  onAuthResume,
}) => {
  const { oktaAuth, authState } = useOktaAuth();
  const [callbackError, setCallbackError] = useState(null);

  const ErrorReporter = errorComponent;

  useEffect(() => {
    const isInteractionRequired =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore OKTA-464505: backward compatibility support for auth-js@5
      oktaAuth.idx.isInteractionRequired || oktaAuth.isInteractionRequired.bind(oktaAuth);
    if (onAuthResume && isInteractionRequired()) {
      onAuthResume();

      return;
    }
    oktaAuth
      .handleLoginRedirect()
      .then(() => {
        // In `<Security>` component service was not started in case of login redirect.
        // Start it now after `restoreOriginalUri` has been called and route changed.
        oktaAuth.start();
      })
      .catch((e) => {
        setCallbackError(e);
      });
  }, [oktaAuth, onAuthResume]);

  const authError = authState?.error;
  const displayError = callbackError || authError;
  if (displayError && ErrorReporter) {
    return <ErrorReporter error={displayError} />;
  }

  return loadingElement;
};
