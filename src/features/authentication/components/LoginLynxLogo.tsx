import Logo from '@carrier-io/fds-react/patterns/Logo/Logo';
import { memo } from 'react';

import LoginPageLogoImageAssetUrl from '../assets/images/login-page-logo.svg';

export const LoginLynxLogo = memo(() => (
  <Logo
    alt="logo"
    href="https://www.carrier.com/truck-trailer/en/eu/service-support/LYNX_fleet/"
    src={LoginPageLogoImageAssetUrl}
    sx={{
      marginBottom: '32px',
      marginTop: '64px',
    }}
  />
));

LoginLynxLogo.displayName = 'LoginLynxLogo';
