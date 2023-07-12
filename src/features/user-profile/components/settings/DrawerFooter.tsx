import { FC } from 'react';
import Box from '@carrier-io/fds-react/Box';
import Grid from '@carrier-io/fds-react/Grid';
import { useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';

import { TermsOfServiceAndPrivacyPolicy, useLogout } from '@/features/authentication';

export const DrawerFooter: FC = () => {
  const { t } = useTranslation();
  const { logout } = useLogout();

  return (
    <Box>
      <Grid container>
        <Typography onClick={logout} sx={{ cursor: 'pointer', marginBottom: '2rem' }} data-testid="sign-out">
          {t('auth.celsius.login.sign-out')}
        </Typography>
      </Grid>
      <TermsOfServiceAndPrivacyPolicy />
    </Box>
  );
};
