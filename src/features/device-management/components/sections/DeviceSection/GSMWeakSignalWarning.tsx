import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import { useTranslation } from 'react-i18next';

import { WarningIcon } from '@/components';

export const GSMWeakSignalWarning = () => {
  const { t } = useTranslation();

  return (
    <Box display="flex" alignItems="center">
      <WarningIcon fontSize="small" />
      <Typography sx={{ ml: 2 }} variant="body1">
        {t('device.management.device.provisioning.gsm-weak-signal-warn')}
      </Typography>
    </Box>
  );
};
