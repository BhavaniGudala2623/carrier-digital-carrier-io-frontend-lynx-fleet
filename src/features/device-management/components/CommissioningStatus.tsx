import { Typography } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import { CheckCircle, Warning, Error } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface CommissioningStatusProps {
  errorsCount: number;
  devicesCount: number;
}

export const CommissioningStatus = ({ errorsCount, devicesCount = 0 }: CommissioningStatusProps) => {
  const { t } = useTranslation();
  let status = 'success';

  if (errorsCount > 0 && devicesCount > 0) {
    status = 'warning';
  } else if (errorsCount > 0 && devicesCount === 0) {
    status = 'error';
  }

  return (
    <>
      {status === 'success' && (
        <Box display="inline-flex" alignItems="center" mt={1}>
          <CheckCircle color="success" fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body1" component="span">
            {t('device.management.device.import.status-success', {
              value: devicesCount,
              action: t('device.management.device.provisioning.commissioned'),
            })}
          </Typography>
        </Box>
      )}
      {status === 'warning' && (
        <Box display="inline-flex" alignItems="center" mt={1}>
          <Warning color="warning" fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body1" component="span">
            {t('device.management.device.import.status-with-errors', {
              value: devicesCount,
              action: t('device.management.device.provisioning.commissioned'),
            })}
          </Typography>
        </Box>
      )}
      {status === 'error' && (
        <Box display="inline-flex" alignItems="center" mt={1}>
          <Error color="error" fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body1" component="span">
            {t('device.management.device.commissioning.import-failed')}
          </Typography>
        </Box>
      )}
    </>
  );
};
