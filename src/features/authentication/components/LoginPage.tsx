import Copyright from '@carrier-io/fds-react/patterns/Copyright/Copyright';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import SignIn from '@carrier-io/fds-react/patterns/SignIn/SignIn';
import { SignInFooter } from '@carrier-io/fds-react/patterns/SignIn/SignInFooter';
import Box from '@carrier-io/fds-react/Box';
import Logo from '@carrier-io/fds-react/patterns/Logo/Logo';

import CarrierLogoUrl from '../assets/images/carrier-logo.png';

import { LoginForm } from './LoginForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { LoginLynxLogo } from './LoginLynxLogo';
import { TermsOfServiceAndPrivacyPolicy } from './TermsOfServiceAndPrivacyPolicy';

export const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <Box height="100vh">
      <SignIn
        footer={
          <SignInFooter
            left={<TermsOfServiceAndPrivacyPolicy labelEntry={t('auth.celsius.login.terms-of-service')} />}
            middle={
              <Logo alt={t('auth.carriers-logo')} href="https://www.carrier.com/" src={CarrierLogoUrl} />
            }
            right={<Copyright text="Carrier" />}
          />
        }
      >
        <LoginLynxLogo />
        <Typography
          sx={{
            marginBottom: '16px',
          }}
          variant="h5"
        >
          {t('auth.celsius.login.welcome-to-lynx-fleet')}
        </Typography>
        <Typography
          color="secondary"
          sx={{
            marginBottom: '24px',
          }}
          variant="body2"
        >
          {t('auth.celsius.login.login-with-your-username-and-password')}
        </Typography>
        <LoginForm />
        <Box
          sx={{
            marginTop: '12px',
          }}
        >
          <ForgotPasswordForm />
        </Box>
      </SignIn>
    </Box>
  );
};
