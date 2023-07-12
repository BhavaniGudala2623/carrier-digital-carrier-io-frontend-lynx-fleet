import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import { Typography } from '@carrier-io/fds-react';

import { AssetOfflineIcon } from '../icons';

import { eventViewIconStyle } from './styles';

export const AssetOfflineEventView = ({ showIcon = true }) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" alignItems="center">
      {showIcon && <AssetOfflineIcon sx={{ ...eventViewIconStyle }} />}
      <Typography component="span" variant="body1">
        &nbsp;{t('notifications.if-fuel')}&nbsp;
        <b>{t('notifications.asset-offline-dialog-content-asset')}&nbsp;</b>&nbsp;
        {t('common.is')}&nbsp;
        <b>{t('notifications.asset-offline-msg')}</b>
      </Typography>
    </Box>
  );
};
