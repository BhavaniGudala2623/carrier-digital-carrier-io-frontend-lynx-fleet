import Grid from '@carrier-io/fds-react/Grid';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { useRbac } from '@carrier-io/rbac-provider-react';

import { ExternalApiKeyInput } from './ExternalApiKeyInput';

import { getAuthUserEmail } from '@/features/authentication';
import { useAppSelector } from '@/stores';
import { actionPayload } from '@/features/authorization';

export const ExternalApiKey: FC = () => {
  const { t } = useTranslation();

  const { hasPermission } = useRbac();
  const email = useAppSelector(getAuthUserEmail);

  const canAccessApiPortal = hasPermission(
    actionPayload({
      action: 'apiPortal.view',
      subjectType: 'USER',
      subjectId: email,
    })
  );

  return canAccessApiPortal ? (
    <ExternalApiKeyInput />
  ) : (
    <Grid container>
      <Typography variant="caption" color="error.dark">
        {t('user.profile.external-api-key.not-enabled')}
      </Typography>
    </Grid>
  );
};
